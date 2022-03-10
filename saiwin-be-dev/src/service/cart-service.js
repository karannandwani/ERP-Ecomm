const Cart = require("../models/cart");
const config = require("../config/config");
const { fetchFacilityByQuery } = require("./facility-service");
const { fetchInventoryByQuery } = require("./inventory-service");
const { fetchProductsByQuery } = require("./product-service");
const { fetcHsnhByQuery } = require("./hsn-service");
const { findOneByQuery } = require("./coupon-service");
const { bodyToCartUpdateObject } = require("../utils/conversion-util");
const { fetchOrderStatusByName } = require("../service/order-status-service");
var Order = require("../models/order");
const { ecommerceEvent } = require("../utils/event-util");
const { findEcommerceOrder } = require("./order-service");
const { validateCouponRequest } = require("../utils/validate-request");
const { findOneCouponByQuery } = require("./coupon-service");
const { findById } = require("./beat-service");
const { findSchemesByQuery } = require("./scheme-service");
const { createRazorPayOrder } = require("./razorpay-service");
exports.addToCart = async (req, res) => {
  try {
    checkForCartAndUpdate(req.body, req.user)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const checkForCartAndUpdate = async (body, user) =>
  new Promise((resolve, reject) => {
    try {
      let cart, facility, beat;
      let products = body.products.map((t) => ({
        product: t.product,
        ordNoOfProduct: t.ordNoOfProduct,
      }));
      if (body.products.length === 0) {
        Cart.findOneAndDelete({
          user: user._id,
          facility: body.facility,
        }).exec();
        reject({ message: "Empty cart." });
      } else {
        findOne({
          user: user._id,
          facility: body.facility,
        })
          .then((result) => {
            cart = result;
            if (result && result.products.length > 0) {
              products.push(
                ...result.products
                  .filter(
                    (x) =>
                      !products
                        .map((y) => y.product)
                        .includes(x.product.toString()) && x.price > 0
                  )
                  .map((x) => ({
                    product: x.product.toString(),
                    ordNoOfProduct: x.ordNoOfProduct,
                  }))
              );
            }
            return fetchFacilityByQuery({ _id: body.facility });
          })
          .then((result) => {
            facility = result;
            return findById(body.beat);
          })
          .then((result) => {
            beat = result;
            return findSchemesByQuery({
              business: body.business,
              type: {
                $in: [
                  "PRODUCT_DISCOUNT",
                  "COMBO_PRODUCT_DISCOUNT",
                  "COMBO_PRODUCT_FREE",
                ],
              },
              $and: [
                { effectFrom: { $lte: new Date() } },
                { effectTill: { $gt: new Date() } },
                { active: true },
              ],
            });
          })
          .then((schemes) => {
            return buildObjectForCart(
              cart,
              body,
              user._id,
              facility,
              products,
              beat,
              schemes
            );
          })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
const findOne = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Cart.findOne(query)
        .populate([{ path: "couponDiscount.coupon" }])
        .then(
          (result) => resolve(result),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Cart.find(query)
        .populate([
          { path: "products.product" },
          { path: "address" },
          { path: "couponDiscount.coupon" },
        ])
        .then(
          (result) => resolve(result),
          (error) => reject(error)
        );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const buildObjectForCart = async (
  cart,
  body,
  user,
  facility,
  products,
  beat,
  schemes
) =>
  new Promise((resolve, reject) => {
    try {
      let evaluatedProducts, productIds, productDocs, inventoryOfBusiness;
      checkForComboScheme(products, schemes)
        .then((result) => {
          evaluatedProducts = result;
          evaluatedProducts = evaluatedProducts.filter(
            (x) => x.ordNoOfProduct > 0
          );
          productIds = evaluatedProducts.map((x) => x.product);
          return fetchInventoryByQuery({
            type: "Business",
            business: body.business,
            product: {
              $in: productIds,
            },
          });
        })
        .then((result) => {
          inventoryOfBusiness = result;
          return fetchProductsByQuery({
            query: {
              _id: { $in: productIds },
            },
            size: null,
            populate: [{ path: "tax" }],
          });
        })
        .then((result) => {
          productDocs = result;
          return fetcHsnhByQuery({
            _id: {
              $in: productDocs.map((t) => t.hsn),
            },
          });
        })
        .then((result) =>
          evaluateCartProduct(
            inventoryOfBusiness,
            productDocs,
            result,
            body,
            user,
            facility,
            evaluatedProducts,
            beat,
            schemes
          )
        )
        .then((result) => validateCoupon(cart, result))
        .then((result) =>
          Cart.findOneAndUpdate(
            {
              user: user._id,
              facility: facility._id,
            },
            result,
            {
              upsert: true,
              new: true,
            }
          )
            .populate([
              { path: "products.product" },
              { path: "couponDiscount.coupon" },
            ])
            .exec()
        )
        .then((result) => resolve(result))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const checkForComboScheme = (products, schemes) =>
  new Promise((resolve, reject) => {
    try {
      if (schemes && schemes.length > 0) {
        let comboDiscount = schemes.filter((x) =>
          x.type.startsWith("COMBO_PRODUCT")
        );
        if (comboDiscount.length > 0) {
          Promise.all(
            products.map((x) => {
              let scheme = comboDiscount.find(
                (cs) => cs.product.toString() === x.product
              );
              if (scheme) {
                let effect = scheme.evaluation
                  .sort((a, b) => b.qty - a.qty)
                  .find((y) => y.qty <= x.ordNoOfProduct);
                if (!effect) {
                  effect = {};
                }
                if (effect.type === "FLAT_DISCOUNT") {
                  x.comboFlatDiscount = effect.discount;
                  return x;
                } else if (effect.type === "PERCENTAGE_DISCOUNT") {
                  x.comboPercentDiscount = effect.discount;
                  return x;
                } else if (effect.type === "FREE_PRODUCT") {
                  return [
                    x,
                    {
                      product: effect.freeProduct,
                      ordNoOfProduct: effect.freeQty,
                      comboProduct: x.product,
                    },
                  ];
                } else {
                  return x;
                }
              } else {
                return x;
              }
            })
          )
            .then((result) => resolve(result.flat()))
            .catch((error) => reject(error));
        } else {
          resolve(products);
        }
      } else {
        resolve(products);
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const evaluateCartProduct = async (
  inventoryOfBusiness,
  productDocs,
  hsnDocs,
  body,
  user,
  facility,
  products,
  beat,
  schemes
) =>
  new Promise((resolve, reject) => {
    try {
      let subTotal = 0;
      let productsToBeSaved = [];
      let productDiscountSchemes = schemes.filter(
        (x) => x.type === "PRODUCT_DISCOUNT"
      );
      for (let index = 0; index < products.length; index++) {
        const product = products[index];

        let invPro = inventoryOfBusiness.find(
          (p) => p.product.toString() === product.product
        );

        let productDetails = productDocs.find(
          (pro) => pro._id.toString() === product.product
        );
        if (!invPro || invPro.products.length === 0) {
          reject({
            message: `There is no stock available for ${productDetails.name}!`,
          });
        }
        let hsn = hsnDocs.find((h) => h._id == productDetails.hsn);
        if (!hsn) {
          reject({
            message: "GST not configured for this product.",
            product: productDetails,
          });
        }
        if (product.comboProduct) {
          let obj = {
            product: product.product,
            ordNoOfCase: 0,
            ordNoOfProduct: product.ordNoOfProduct,
            price: 0,
            productPrice: 0,
            tax: [],
            comboProduct: product.comboProduct,
          };
          productsToBeSaved.push(obj);
        } else {
          let currentLot =
            config.lotPriceChoose === "LAST_RECEIVED"
              ? invPro.products[invPro.products.length - 1]
              : invPro.products.sort(
                  (x, y) => y.retailPrice - x.retailPrice
                )[0];

          let price = 0;
          let schemeToBeApplied = productDiscountSchemes.find((x) =>
            x.condition.products.includes(product.product)
          );
          price +=
            (schemeToBeApplied
              ? currentLot.retailPrice -
                (schemeToBeApplied.effect.type == "FLAT_DISCOUNT"
                  ? schemeToBeApplied.effect.value
                  : (currentLot.retailPrice * schemeToBeApplied.effect.value) /
                    100)
              : currentLot.retailPrice) * product.ordNoOfProduct;

          if (product.comboFlatDiscount) {
            price -= product.comboFlatDiscount;
          }

          if (product.comboPercentDiscount) {
            price -= (price * product.comboPercentDiscount) / 100;
          }
          let tax = hsn.tax
            .filter((x) => x.name !== "IGST")
            .map((x) => {
              return {
                type: x.name,
                percent: x.percentage,
                amount: (price * x.percentage) / 100,
              };
            });

          let obj = {
            product: product.product,
            ordNoOfCase: 0,
            ordNoOfProduct: product.ordNoOfProduct,
            price: price,
            productPrice: currentLot.retailPrice,
            tax: tax,
          };
          productsToBeSaved.push(obj);
          subTotal += price;
          tax.forEach((x) => (subTotal += x.amount));
        }
      }
      resolve({
        user: user,
        facility: facility._id,
        business: body.business,
        beat: beat,
        products: productsToBeSaved,
        subTotal: subTotal,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const validateCoupon = async (cart, updatedCartObj) =>
  new Promise((resolve, reject) => {
    try {
      let coupon =
        cart && cart.couponDiscount ? cart.couponDiscount.coupon : null;
      if (coupon) {
        let currentDate = new Date();
        if (
          coupon.validFrom > currentDate ||
          coupon.validTill < currentDate ||
          updatedCartObj.subTotal < coupon.minCartValue
        ) {
          resolve({
            $set: updatedCartObj,
            $unset: {
              couponDiscount: 1,
              priceBeforeDiscount: 1,
            },
          });
          return;
        }
        let discountedPrice;
        if (coupon.discountType === "Flat") {
          discountedPrice = coupon.discountAmount;
        } else {
          let totalProductPrice = updatedCartObj.products.reduce(
            (a, b) => a + b.productPrice * b.ordNoOfProduct,
            0
          );
          let discountAccordingToPercent =
            (totalProductPrice * coupon.discountAmount) / 100;
          discountedPrice =
            discountAccordingToPercent > coupon.ceilingValue
              ? coupon.ceilingValue
              : discountAccordingToPercent;
        }
        resolve({
          $set: {
            ...updatedCartObj,
            priceBeforeDiscount: updatedCartObj.subTotal,
            subTotal: updatedCartObj.subTotal - discountedPrice,
            couponDiscount: {
              coupon: coupon._id,
              discount: discountedPrice,
            },
          },
        });
      } else {
        resolve({ $set: updatedCartObj });
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const update = async (cartId, obj) =>
  new Promise((resolve, reject) => {
    try {
      Cart.findByIdAndUpdate(cartId, obj, { new: true })
        .populate([
          { path: "products.product" },
          { path: "address" },
          { path: "couponDiscount.coupon" },
        ])
        .then(
          (result) => resolve(result),
          (error) => reject(error)
        );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.getCartByUser = async (req, res) => {
  try {
    findByQuery({
      user: req.user._id,
    })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.placeOrder = async (req, res) => {
  try {
    let cart, productDocs, orderObj, facility;
    findOne({
      _id: req.body._id,
    })
      .then((result) => {
        cart = result;
        return fetchFacilityByQuery({ _id: cart.facility });
      })

      .then((result) => {
        facility = result;
        return fetchProductsByQuery({
          query: {
            _id: { $in: cart.products.map((t) => t.product) },
          },
          size: null,
          populate: [],
        });
      })
      .then((result) => {
        productDocs = result;
        return fetcHsnhByQuery({
          _id: {
            $in: productDocs.map((t) => t.hsn),
          },
        });
      })

      .then((result) => createOrderObject(cart, productDocs, result))
      .then((result) => createOrder(cart, result, facility, req.body))
      .then((result) => updateCartPostOrderPlace(result, req.body._id))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const updateCartPostOrderPlace = async (order, cartId) =>
  new Promise((resolve, reject) => {
    deleteCart(cartId)
      .then((result) => findEcommerceOrder({ _id: order._id }))
      .then((result) => resolve(result[0]))
      .catch((error) => reject(error));
  });

const createOrderObject = async (cart, productDocs, hsnDocs) =>
  new Promise((resolve, reject) => {
    try {
      let order = new Object();
      order.facility = cart.facility;
      let products = [];

      for (let index = 0; index < cart.products.length; index++) {
        const product = cart.products[index];
        let productDetails = productDocs.find(
          (pro) => pro._id.toString() === product.product.toString()
        );

        let hsnGst = hsnDocs.find((hsn) => hsn._id == productDetails.hsn);
        if (!hsnGst) {
          reject({
            message: "GST not configured for this product",
            product: product,
          });
        }

        let obj = {
          product: product.product,
          ordNoOfCase: product.ordNoOfCase,
          ordNoOfProduct: product.ordNoOfProduct,
          price: product.price,
          tax: product.tax,
          comboProduct: product.comboProduct,
        };
        products.push(obj);
      }
      order.products = products;
      resolve(order);
    } catch (e) {
      reject(e);
    }
  });

const createOrder = async (cart, order, facility, body) =>
  new Promise((resolve, reject) => {
    try {
      fetchOrderStatusByName("Generated")
        .then((result) => {
          let orderObj = {
            suppliers: cart.facility,
            business: cart.business,
            beat: cart.beat,
            status: result._id,
            createdBy: cart.user,
            products: order.products,
            subTotal: cart.subTotal,
            checkoutSubtotal: cart.subTotal,
            orderNo: facility.shortName + facility.billNo,
            type: "E-COM",
            address: cart.address,
            payment: body.payment,
            id: `O${facility.shortName.toUpperCase()}${new Date()
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")}${
              new Date().toLocaleTimeString().replace(/:/g, "").split(" ")[0]
            }`,
          };
          if (cart.couponDiscount) {
            orderObj.discount = cart.couponDiscount.discount;
            orderObj.subTotal -= cart.couponDiscount.discount;
          }
          let newOrder = new Order(orderObj);
          newOrder.save((error, response) => {
            if (error) {
              console.error(error);
              reject(error);
            }

            if (response) {
              ecommerceEvent.emit("order-place", response);
              resolve(response);
            } else {
              reject({
                message: "Unable to process.",
              });
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.updateCart = async (req, res) => {
  try {
    bodyToCartUpdateObject(req.body)
      .then((result) => update(req.body._id, { $set: result }))
      .then((result) =>
        req.body.address ? createPaymentOrder(result) : result
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const deleteCart = async (_id) =>
  new Promise((resolve, reject) => {
    Cart.findByIdAndDelete(_id, (error, response) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      if (response) {
        resolve(response);
      }
    });
  });

exports.manageCouponForCart = async (req, res) => {
  try {
    let cart;
    validateCouponRequest(req.body)
      .then((result) => findOne({ _id: req.body._id }))
      .then((result) => {
        cart = result;
        return req.body.action === "Apply"
          ? findOneCouponByQuery({ _id: req.body.coupon })
          : null;
      })
      .then((result) =>
        req.body.action === "Apply"
          ? validateAndApplyCoupon(cart, result)
          : removeCoupon(cart)
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const validateAndApplyCoupon = async (cart, coupon) =>
  new Promise((resolve, reject) => {
    try {
      let currentDate = new Date();
      if (coupon.validFrom > currentDate || coupon.validTill < currentDate) {
        reject({ message: "Invalid Coupon!" });
        return;
      }

      if (cart.subTotal < coupon.minCartValue) {
        reject({ message: "Insufficient cart value!" });
        return;
      }
      let discountedPrice;
      if (coupon.discountType === "Flat") {
        discountedPrice = coupon.discountAmount;
      } else {
        let totalProductPrice = cart.products.reduce(
          (a, b) => a + b.productPrice * b.ordNoOfProduct,
          0
        );
        let discountAccordingToPercent =
          (totalProductPrice * coupon.discountAmount) / 100;
        discountedPrice =
          discountAccordingToPercent > coupon.ceilingValue
            ? coupon.ceilingValue
            : discountAccordingToPercent;
      }

      let obj = {
        priceBeforeDiscount: cart.subTotal,
        subTotal: cart.subTotal - discountedPrice,
        couponDiscount: {
          coupon: coupon._id,
          discount: discountedPrice,
        },
      };
      Cart.findByIdAndUpdate(
        cart._id,
        {
          $set: obj,
        },
        { new: true }
      )
        .populate([
          { path: "products.product" },
          { path: "address" },
          { path: "couponDiscount.coupon" },
        ])
        .then(
          (result) => resolve(result),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const removeCoupon = async (cart) =>
  new Promise((resolve, reject) => {
    try {
      Cart.findByIdAndUpdate(
        cart._id,
        {
          $set: {
            subTotal: cart.priceBeforeDiscount,
          },
          $unset: {
            priceBeforeDiscount: 1,
            couponDiscount: 1,
          },
        },
        { new: true }
      )
        .populate([{ path: "products.product" }, { path: "address" }])
        .then((result) => resolve(result))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const createPaymentOrder = async (cart) =>
  new Promise((resolve, reject) => {
    try {
      createRazorPayOrder(Number(cart.subTotal).toFixed(2), "INR")
        .then((result) =>
          update(cart._id, { payment: { razorPayOrderId: result.id } })
        )
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

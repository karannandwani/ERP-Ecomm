const Order = require("../models/order");
const Notification = require("../models/notification");
var pdf = require("html-pdf");
const { saveOrUpdateUser } = require("./user-service");
const { fetchFacilityByQuery } = require("./facility-service");
const { fetchInventoryByQuery } = require("./inventory-service");
const { fetchProductsByQuery } = require("./product-service");
const { fetcHsnhByQuery } = require("./hsn-service");
const { queryToBillFilterObject } = require("../utils/conversion-util");
const {
  billEvent,
  notificationEvent,
  inventoryLedgerEvent,
} = require("../utils/event-util");
const { createBillValidate } = require("../utils/validate-request");

exports.fetchBills = async (req, res) => {
  try {
    queryToBillFilterObject(req.query)
      .then((result) => this.fetchBillByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchBillsNew = async (req, res) => {
  try {
    queryToBillFilterObject(req.body)
      .then((result) => this.fetchBillByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.designBill = async (req, res) => {
  try {
    const billId = req.params.billId;
    Order.findById(billId)
      .populate("products.product")
      .then(
        async (_res_exst) => {
          if (_res_exst) {
            const bill = _res_exst;
            const html = `<html>
            <head>
              <style>
                .zigzag {
                  position: relative;
                  width: 100%;
                }
                .text-design {
                  font-size: 15px;
                }
          
                .p-5-px {
                  padding: 5px;
                }
                .mn-ht-20 {
                  min-height: 20%;
                }
                .ml-7-px {
                  margin-left: 7px;
                }
                .item-list-card {
                  min-height: 10%;
                  background-size: 20px 40px;
                  color: black;
                  margin: 10px 0px 30px 0px;
                  padding: 5px;
                }
          
                .title {
                  color: black;
                }
                table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                }
          
                td,
                th {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
          font-size: 10px;
  
                }
          
                tr:nth-child(even) {
                  background-color: #dddddd;
                }
              </style>
            </head>
            <body>
              <div class="p-5-px">
                <h3>Bill Details</h3>
              </div>
              <div>Bill No #<span>${bill.orderNo}</span></div>
              <p style="font-size:10px">Ordered on ${bill._id.getTimestamp().toDateString() +
              "," +
              bill._id.getTimestamp().toLocaleTimeString()
              }</p>
              <div>
                <div id="table">
                  <table class="table">
                    <!-- <hr /> -->
                    ${bill.products.map((item) => {
                return `
                    <tr class="service">
                      <th class="text-design" id="item">Item</th>
                      <th class="text-design" id="prdctQty">Product/Qty</th>
                      <th class="text-design" id="csQty">Case/Qty</th>
                      <th class="text-design" id="price">Price</th>
                    </tr>
                    <tr class="service">
                      <td>
                        <p class="text-design">${item.product.name}</p>
                      </td>
                      <td>
                        <p class="text-design">x ${item.acpNoOfProduct}</p>
                      </td>
                      <td>
                        <p class="text-design">Case x ${item.acpNoOfCase}</p>
                      </td>
                      <td>
                      <p class="text-design">Rs ${item.price}</p>
                    </td>
                    </tr>
                    `;
              })}
          
                  </table>
                </div>
              </div>
              <hr />
              <p class="text-design">Total Amount : ₹ ${bill.subTotal.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                  style: "currency",
                  currency: "INR",
                }
              )}</p>
              <div id="legalcopy">
                <p class="legal text-design">
                  <strong>Thank you for your business!</strong> 
                </p>
              </div>
            </body>
          </html>`;
            let bufferRes;
            await Promise.all([
              new Promise((resolve, reject) => {
                pdf.create(html).toBuffer((err, buffer) => {
                  if (err) {
                    reject(err);
                  }
                  if (buffer) {
                    bufferRes = buffer;
                    resolve();
                  }
                });
              }),
            ]);
            return res.status(200).json({ json: bufferRes.toString("base64") });
          }
        },
        (_err_exst) => {
          console.error(_err_exst);
          res.status(500).json(_err_exst);
        }
      );
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.fetchBillByQuery = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Order.aggregate(
        [
          {
            $match: queryObj.query,
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products",
              let: {
                pId: "$products.product",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$pId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                  },
                },
              ],
              as: "pro",
            },
          },
          {
            $unwind: "$pro",
          },
          {
            $match: {
              $or: [
                {
                  "pro.name": queryObj.name,
                },
                {
                  orderNo: queryObj.name,
                },
              ],
            },
          },
          {
            $group: {
              _id: "$_id",
              business: {
                $first: "$business",
              },
              products: {
                $push: {
                  _id: "$products._id",
                  product: "$pro",
                  ordNoOfCase: "$products.ordNoOfCase",
                  ordNoOfProduct: "$products.ordNoOfProduct",
                  acpNoOfCase: "$products.acpNoOfCase",
                  acpNoOfProduct: "$products.acpNoOfProduct",
                  price: "$products.price",
                  lots: "$products.lots",
                  extraTax: "$products.extraTax",
                },
              },
              id: {
                $first: "$id",
              },
              type: {
                $first: "$type",
              },
              suppliers: {
                $first: "$suppliers",
              },
              orderNo: {
                $first: "$orderNo",
              },
              subTotal: {
                $first: "$subTotal",
              },
              discount: {
                $first: "$discount",
              },
            },
          },
          {
            $skip: queryObj.skip,
          },
          {
            $limit: queryObj.limit,
          },
          { $sort: { _id: -1 } },
        ],
        (_err, _res) => {
          if (_err) {
            console.error(_err);
            reject(_err);
          }

          if (_res) {
            resolve(_res);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.createBill = async (req, res) => {
  try {
    let body = req.body;
    let productDocs, inventoryOfSupplier, supplier, user;
    let productIds = body.products.map((t) => t.product);
    createBillValidate(body)
      .then((result) =>
        saveOrUpdateUser({ email: body.email, role: "Customer" })
      )
      .then((result) => {
        user = result;
        return fetchFacilityByQuery({ _id: body.suppliers });
      })
      .then((result) => {
        supplier = result;
        return fetchInventoryByQuery({
          facility: supplier._id,
          product: {
            $in: productIds,
          },
        });
      })
      .then((result) => {
        inventoryOfSupplier = result;
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
        buildOrderObjectForPOS(
          result,
          body,
          inventoryOfSupplier,
          productDocs,
          user,
          supplier
        )
      )
      .then((order) => save(order, supplier, req.user))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const buildOrderObjectForPOS = async (
  gstHsnDocs,
  body,
  inventoryOfSupplier,
  productDocs,
  user,
  supplier
) =>
  new Promise((resolve, reject) => {
    try {
      let order = new Object();
      order.business = body.business;
      order.id = body.id;
      order.subTotal = 0;
      let products = [];

      let newInventoryArray = [];
      for (let index = 0; index < body.products.length; index++) {
        order.totalPrice = 0;
        const product = body.products[index];
        let invPro = inventoryOfSupplier.find(
          (p) => p.product.toString() === product.product
        );
        let productDetails = productDocs.find(
          (pro) => pro._id.toString() === product.product
        );

        let hsn = gstHsnDocs.find((hsn) => hsn._id == productDetails.hsn);
        if (!hsn) {
          reject({
            message: "GST not configured for this product",
            product: product,
          });
        }
        let lotArray = [],
          noOfCase = 0,
          noOfProduct = 0;
        let existingLot = new Map();
        invPro.products.forEach((t) => {
          existingLot.set(t._id.toString(), JSON.parse(JSON.stringify(t)));
        });
        let totalPrice = 0;
        let costPrice = 0,
          retailPrice = 0,
          discountPrice = 0;

        for (let pi = 0; pi < product.lotArray.length; pi++) {
          const t = product.lotArray[pi];

          let currentLot = invPro.products.find(
            (l) => l._id.toString() === t.lotId
          );

          if (
            (currentLot.noOfCase ? currentLot.noOfCase : 0) *
            currentLot.qtyPerCase +
            (currentLot.noOfProduct ? currentLot.noOfProduct : 0) <
            (t.noOfCase ? t.noOfCase : 0) * currentLot.qtyPerCase +
            (t.noOfProduct ? t.noOfProduct : 0)
          ) {
            let date = new Date(
              parseInt(t.lotId.toString().substring(0, 8), 16) * 1000
            );
            let displayDate = new Date(date.toISOString()).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );
            reject({
              message:
                "The selected lot " +
                displayDate +
                " do not have surplus products to fulfil the order,please select another lot.",
            });
          }
          let price = 0;

          price +=
            currentLot.retailPrice *
            (currentLot.qtyPerCase * t.noOfCase + t.noOfProduct);

          let tax = hsn.tax
            .filter((x) => x.name !== "IGST")
            .map((x) => {
              return {
                type: x.name,
                percent: x.percentage,
                amount: (price * x.percentage) / 100,
              };
            });

          totalPrice += price;
          noOfCase += t.noOfCase ? t.noOfCase : 0;
          noOfProduct += t.noOfProduct ? t.noOfProduct : 0;
          let lotObj = {
            id: currentLot.id,
            lotId: currentLot.lotId,
            noOfProduct: t.noOfProduct ? t.noOfProduct : 0,
            noOfCase: t.noOfCase ? t.noOfCase : 0,
            costPrice: currentLot.costPrice,
            wholesalePrice: currentLot.wholesalePrice,
            retailPrice: currentLot.retailPrice,
            qtyPerCase: currentLot.qtyPerCase,
            mrp: currentLot.mrp,
            expiryDate: currentLot.expiryDate,
            barcodeNo: currentLot.barcodeNo,
            barCode: currentLot.barCode,
            scheme: currentLot.scheme,
            tax: tax,
            track: `Bill No ${supplier.shortName + supplier.billNo} sold ${user && user.user ? "to " + user.user.name : ""
              }`,
            customer: user ? user._id : null,
            orderNo: supplier.shortName + supplier.billNo,
            price: currentLot.retailPrice
          };
          lotArray.push(lotObj);
          let currLot = {
            _id: currentLot._id,
            id: currentLot.id,
            noOfProduct: t.remainingNoOfProducts,
            noOfCase: t.remainingNoOfCases,
            costPrice: currentLot.costPrice,
            wholesalePrice: currentLot.wholesalePrice,
            retailPrice: currentLot.retailPrice,
            qtyPerCase: currentLot.qtyPerCase,
            expiryDate: currentLot.expiryDate,
            mrp: currentLot.mrp,
            scheme: currentLot.scheme,
            supplier: currentLot.supplier,
            orderId: currentLot.orderId,
            lotId: currentLot.lotId,
            barcodeNo: currentLot.barcodeNo,
            barCode: currentLot.barCode,
          };
          existingLot.set(currentLot._id.toString(), currLot);
          order.subTotal += Number(price);
          tax.forEach((x) => (order.subTotal += x.amount));
        }

        let invObj = {
          _id: invPro._id,
          products: Array.from(existingLot.values()),
          inTransit: 0,
        };
        newInventoryArray.push(invObj);

        inventoryLedgerEvent.emit("create", {
          inventory: invPro,
          products: lotArray,
        });

        let obj = {
          product: product.product,
          ordNoOfCase: product.ordNoOfCase ? product.ordNoOfCase : 0,
          ordNoOfProduct: product.ordNoOfProduct ? product.ordNoOfProduct : 0,
          acpNoOfCase: noOfCase,
          acpNoOfProduct: noOfProduct,
          price: totalPrice,
          lots: lotArray,
        };
        if (productDetails.tax) {
          obj.extraTax = productDetails.tax.map((x) => ({
            name: x.name,
            amount: (totalPrice * x.percentage) / 100,
            percentage: x.percentage,
          }));
          obj.extraTax.map((x) => (order.subTotal += x.amount));
        }
        order.totalPrice = order.totalPrice + Number(totalPrice);
        products.push(obj);
      }

      if (body.discount) {
        if (body.discount > order.subTotal) {
          reject({
            message: "Discount amount cannot exceed the Subtotal amount",
          });
          return;
        } else {
          order.subTotal = order.subTotal - Number(body.discount);
        }
      }
      if (body.forcedDiscount) {
        notificationEvent.emit("create", {
          facility: supplier,
        });
      }
      order.discount = body.discount;
      order.products = products;
      order.email = body.email;
      order.type = "Bill";
      order.suppliers = body.suppliers;
      order.orderNo = supplier.shortName + supplier.billNo;
      resolve({ order: order, newInventoryArray: newInventoryArray });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

// notificationEvent.on("create", (data) => {
//   try {
//     for (let index = 0; index < data.facility.suppliers.length; index++) {
//       const element = data.facility.suppliers[index];
//       let obj = {
//         to: element.name,
//         from: data.facility.name,
//         remark: `This facility ${data.facility.name} is selling products at a price which is lower than cost price`,
//       };
//       let notification = new Notification(obj);
//       notification.save((error, response) => {
//         if (error) {
//           console.error(error);
//         }
//       });
//     }
//   } catch (e) {
//     console.error(e);
//   }
// });

const save = async (obj, supplier, user) =>
  new Promise((resolve, reject) => {
    try {
      let order = Order(obj.order);
      order.save((_err, _res) => {
        if (_err) {
          console.error(_err);
          reject(_err);
        }

        if (_res) {
          billEvent.emit("created", {
            bill: _res,
            supplier: supplier._id,
            inventory: obj.newInventoryArray,
            user: user,
          });
          Order.populate(
            _res,
            [{ path: "products.product" }],
            (error, response) => {
              if (error) {
                console.error(error);
                reject(error);
              }
              if (response) {
                resolve(response);
              }
            }
          );
        } else {
          reject({
            message: "Unable to process",
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

var Product = require("../models/product");
var xlsx = require("xlsx");
var ImageService = require("./image-service");
// var excelParser = require('excel-parser');
var mongoose = require("mongoose");
const fs = require("fs");

const { fetchBusinessById } = require("./business-service");
const {
  manufacturerExists,
  findByQuery,
  createMultipleManufacturer,
} = require("./manufacturer-service");
const {
  brandExists,
  findBrand,
  createMultipleBrand,
} = require("./brand-service");
const {
  pricelistExists,
  findPricelistByQuery,
  createMultiplePricelist,
} = require("./pricelist-group-service");
const { hsnExists, findHsn, createMultipleHsn } = require("./hsn-service");
const {
  categoryExists,
  findCategory,
  createMultipleCategory,
} = require("./category-service");
const {
  bodyToProductObject,
  bodyToProductFilterObject,
  escapeRegex,
  bodyToInventoryFilterForReturn,
  bodyToMultipleProduct,
} = require("../utils/conversion-util");
const { findTaxByQuery } = require("./tax-service");
const { addProductValidate } = require("../utils/validate-request");
const { fetchFacilityByLocation } = require("./facility-service");
const { keywordEvent } = require("../utils/event-util");

exports.create = async (req, res) => {
  try {
    let body = req.body;
    let imagesToBeSaved;

    this.saveImage(body.image)
      .then((result) => {
        imagesToBeSaved = result;
        return addProductValidate(body);
      })
      .then(() => fetchBusinessById(body.business))
      .then(() => manufacturerExists(body.manufacturer))
      .then(() => brandExists(body.brand))
      .then(() => categoryExists(body.category))
      .then(() =>
        body.priceListGroup ? pricelistExists(body.priceListGroup) : null
      )
      .then(() => hsnExists(body.hsn))
      .then(() => validateTax(body.tax))
      .then(() => bodyToProductObject(body, imagesToBeSaved))
      .then((result) => (body._id ? update(result, body) : create(result)))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          error.message = "Already exist!!!";
        }
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.saveImage = async (images) =>
  new Promise((resolve, reject) => {
    if (images && images.length > 0) {
      Promise.all(
        images.map((image) => {
          return ImageService.resizeImage(image.imageData).then(
            (response) => {
              let obj = {
                mimType: response.mimType,
                image: response.image,
                featured: image.featured,
              };
              return obj;
            },
            (error) => {
              console.error(error);
              reject(error);
            }
          );
        })
      )
        .then((result) => resolve(result))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } else {
      resolve([]);
    }
  });

const update = async (obj, body) =>
  new Promise((resolve, reject) => {
    try {
      Product.findByIdAndUpdate(body._id, { $set: obj }, { new: true })
        .populate([
          { path: "brand" },
          { path: "category" },
          { path: "manufacturer" },
          { path: "hsn" },
          { path: "priceListGroup" },
          { path: "tax" },
        ])
        .then(
          (result) => {
            if (result) {
              resolve(result);
              let obj = {
                business: result.business,
                type: "Product",
                itemId: result._id,
                itemName: result.name,
              };
              keywordEvent.emit("create", obj);
            } else {
              reject({ message: "Unable to Save!" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      reject(e);
    }
  });

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let product = Product(obj);
      product.save((err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          Product.populate(
            resp,
            [
              { path: "brand" },
              { path: "category" },
              { path: "manufacturer" },
              { path: "hsn" },
              { path: "priceListGroup" },
              { path: "tax" },
            ],
            (err, resp) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              if (resp) {
                resolve(resp);
              }
            }
          );
          let obj = {
            business: resp.business,
            type: "Product",
            itemId: resp._id,
            itemName: resp.name,
          };
          keywordEvent.emit("create", obj);
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
exports.fetchProducts = async (req, res) => {
  try {
    bodyToProductFilterObject(req.body)
      .then((result) => this.fetchProduct(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.productById = async (req, res) => {
  try {
    Product.findById(req.params.productId)
      .populate([
        { path: "brand" },
        { path: "category" },
        { path: "priceListGroup" },
        { path: "manufacturer" },
        { path: "hsn" },
        { path: "tax" },
      ])
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (error) => {
          console.error(error);
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.productCount = async (req, res) => {
  try {
    let queryObj = new Object();
    if (req.params.business) {
      queryObj.business = req.params.business;
    }
    Product.aggregate(
      [
        {
          $match: queryObj,
        },
        {
          $group: {
            _id: null,
            productCount: {
              $sum: 1,
            },
          },
        },
      ],
      (err_count, res_count) => {
        if (err_count) {
          console.error(err_count);
          return res.status(500).json(err_count);
        }

        if (res_count) {
          return res.status(200).json(res_count);
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchProductWithStock = async (req, res) => {
  try {
    let queryObj = new Object();
    let query = req.body;
    if (query.name) {
      queryObj.name = new RegExp(escapeRegex(query.name), "gi");
    }

    if (query.excludeIds) {
      queryObj._id = {
        $nin: query.excludeIds.map((xx) => mongoose.Types.ObjectId(xx)),
      };
    }
    if (query.business) {
      queryObj.business = query.business;
    }
    Product.aggregate(
      [
        {
          $match: queryObj,
        },
        {
          $lookup: {
            from: "inventories",
            let: {
              pId: "$_id",
              fId: mongoose.Types.ObjectId(query.facility),
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$product", "$$pId"],
                      },
                      {
                        $eq: ["$facility", "$$fId"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "inventory",
          },
        },
        {
          $unwind: "$inventory",
        },
      ],
      (_err, _res) => {
        if (_err) {
          return res.status(500).json(_err);
        }

        if (_res) {
          return res.status(200).json(_res);
        } else {
          return res.status(204).json();
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchProductsByQuery = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      Product.find(obj.query, obj.project, obj.size)
        .populate(obj.populate)
        .then(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              console.error({ message: "No product found" });
              reject({ message: "No product found" });
            }
          },
          (error) => reject(error)
        );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.fetchProduct = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Product.aggregate(
        [
          {
            $match: queryObj.query,
          },
          {
            $lookup: {
              from: "brands",
              let: {
                bId: "$brand",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$bId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "brand",
            },
          },
          {
            $unwind: "$brand",
          },
          {
            $lookup: {
              from: "hsns",
              let: {
                hId: "$hsn",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$hId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    hsn: 1,
                    tax: 1,
                  },
                },
              ],
              as: "hsn",
            },
          },
          {
            $unwind: "$hsn",
          },
          {
            $lookup: {
              from: "taxes",
              localField: "hsn.tax",
              foreignField: "_id",
              as: "hsnTaxes",
            },
          },
          {
            $lookup: {
              from: "manufacturers",
              let: {
                mId: "$manufacturer",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$mId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "manufacturer",
            },
          },
          {
            $unwind: "$manufacturer",
          },
          {
            $lookup: {
              from: "categories",
              let: {
                cId: "$category",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$cId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $lookup: {
              from: "taxes",
              localField: "tax",
              foreignField: "_id",
              as: "tax",
            },
          },
          {
            $lookup: {
              from: "pricelistgroups",
              let: {
                pId: "$priceListGroup",
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
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "priceListGroup",
            },
          },
          {
            $unwind: {
              path: "$priceListGroup",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  "manufacturer.name": queryObj.name,
                },
                { "category.name": queryObj.name },
                { "brand.name": queryObj.name },
                { "priceListGroup.name": queryObj.name },
                { name: queryObj.name },
              ],
            },
          },
          // {
          //   $skip: queryObj.skip,
          // },
          // {
          //   $limit: queryObj.limit,
          // },
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

const validateTax = async (taxIds) =>
  new Promise((resolve, reject) => {
    try {
      if (taxIds)
        findTaxByQuery({ _id: { $in: taxIds } })
          .then((result) => {
            if (!result || result.length !== taxIds.length) {
              console.error("Invalid Tax");
              reject({ message: "Invalid Tax" });
            } else {
              resolve(result);
            }
          })
          .catch((error) => reject(error));
      else resolve(true);
    } catch (e) {
      reject(e);
    }
  });

exports.fetchProductForReturn = async (req, res) => {
  try {
    bodyToInventoryFilterForReturn(req.body)
      .then((result) => fetchProductForReturn(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchProductForReturn = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Product.aggregate(
        [
          {
            $match: queryObj.match,
          },
          {
            $lookup: {
              from: "inventories",
              let: {
                pId: "$_id",
                fId: queryObj.facility,
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$product", "$$pId"],
                        },
                        {
                          $eq: ["$facility", "$$fId"],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "inventory",
            },
          },
          {
            $unwind: "$inventory",
          },
          {
            $unwind: "$inventory.products",
          },
          {
            $match: {
              "inventory.products.supplier": queryObj.supplier,
            },
          },
          {
            $group: {
              _id: "$_id",
              name: {
                $first: "$name",
              },
              brand: {
                $first: "$brand",
              },
              sku: {
                $first: "$sku",
              },
              basepackCode: {
                $first: "$basepackCode",
              },
              hsn: {
                $first: "$hsn",
              },
              description: {
                $first: "$description",
              },
              category: {
                $first: "$category",
              },
              priceListGroup: {
                $first: "$priceListGroup",
              },
              manufacturer: {
                $first: "$manufacturer",
              },
              qtyPerCase: {
                $first: "$qtyPerCase",
              },
              notifyBeforeExpiry: {
                $first: "$notifyBeforeExpiry",
              },
              image: {
                $first: "$image",
              },
              business: {
                $first: "$business",
              },
              tax: {
                $first: "$tax",
              },
              inventory: {
                $push: {
                  facility: "$inventory.facility",
                  products: "$inventory.products",
                  _id: "$inventory._id",
                },
              },
            },
          },
        ],
        (error, response) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          resolve(response);
        }
      );
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.createMultiple = async (req, res) => {
  try {
    let productNames, data, hsn;
    bodyToMultipleProduct(req.body)
      .then((result) => {
        var wb = xlsx.read(result.file, { type: "base64" });
        data = xlsx.utils.sheet_to_json(wb.Sheets["Sheet1"]);
        return findProduct(
          data.map((d) => d["Product Name"]),
          req.body.business
        )
          .then((result) => {
            productNames = result.map((x) => x.name);
            return findHsn({
              hsn: {
                $in: data.map((d) => d["HSN Number"].trim()),
              },
              business: req.body.business,
            });
          })
          .then((result) => {
            hsn = result;
            return validate(
              data,
              productNames,
              result.map((y) => y.hsn)
            );
          });
      })
      .then((result) => {
        return findAndSave(
          result.toBeSaved,
          req.body.business,
          result.brandMap,
          result.errorData,
          hsn
        );
      })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
  }
};

const findAndSave = async (
  toBeSaved,
  business,
  brandMap,
  responseList,
  hsnList
) =>
  new Promise((resolve, reject) => {
    try {
      let categories, brands, priceLists, manufacturerList;

      findAndSaveCategories(
        [...new Set(toBeSaved.map((x) => x["Category"]))],
        business
      )
        .then((result) => {
          categories = result;
          return findAndSavePriceList(
            [...new Set(toBeSaved.map((x) => x["Pricelist Group"]))],
            business
          );
        })
        .then((result) => {
          priceLists = result;
          return findAndSaveManufacturer(
            [...new Set(toBeSaved.map((x) => x["Manufacturer"]))],
            business
          );
        })
        .then((result) => {
          manufacturerList = result;
          return findAndSaveBrands(
            [...new Set(toBeSaved.map((x) => x["Brand"]))],
            business,
            manufacturerList,
            brandMap
          );
        })
        .then((result) => {
          brands = result;
          let products = [];
          for (let index = 0; index < toBeSaved.length; index++) {
            const e = toBeSaved[index];
            let obj = {
              name: e["Product Name"].trim(),
              business: business,
              brand: brands.find((x) => x.name === e["Brand"])._id,
              sku: e["SKU"],
              basepackCode: e["Basepack Code"],
              hsn: hsnList.find((x) => x.hsn === e["HSN Number"].toString())
                ._id,
              description: e["Description"],
              category: categories.find((x) => x.name === e["Category"])._id,
              priceListGroup: priceLists.find(
                (x) => x.name === e["Pricelist Group"]
              )._id,
              manufacturer: manufacturerList.find(
                (x) => x.name === e["Manufacturer"]
              )._id,
              qtyPerCase: e["Qty per case"],
              notifyBeforeExpiry: e["Notify Before"],
              returnable: e["Returnable"],
              sku: e["Product Name"].trim().replace(/ /g, "_"),
            };
            if (!products.map((x) => x.name).includes(obj.name)) {
              products.push(obj);
            }
          }
          saveProducts(products).then((result) => {
            resolve([...responseList, ...result]);
          });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findAndSaveCategories = async (categories, business) =>
  new Promise((resolve, reject) => {
    try {
      findCategory({
        query: {
          name: {
            $in: categories,
          },
        },
      }).then((categoryResp) => {
        let category = categories.filter(
          (x) => !categoryResp.map((t) => t.name).includes(x)
        );
        if (category.length > 0) {
          createMultipleCategory(category, business).then((result) => {
            resolve([...categoryResp, ...result]);
          });
        } else {
          resolve(categoryResp);
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findAndSaveHsn = async (hsnList, business) =>
  new Promise((resolve, reject) => {
    try {
      findHsn(hsnList).then((hsnResp) => {
        let hsn = hsnList.filter((x) => !hsnResp.map((t) => t.hsn).includes(x));
        if (hsn.length > 0) {
          createMultipleHsn(hsn, business).then((result) => {
            resolve([...hsnResp, ...result]);
          });
        } else {
          resolve(hsnResp);
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findAndSavePriceList = async (priceLists, business) =>
  new Promise((resolve, reject) => {
    try {
      findPricelistByQuery({
        query: { name: { $in: priceLists } },
      }).then((priceListGroupResp) => {
        let priceListGroup = priceLists.filter(
          (x) => !priceListGroupResp.map((t) => t.name).includes(x)
        );
        if (priceListGroup.length > 0) {
          createMultiplePricelist(priceListGroup, business).then((result) => {
            resolve([...priceListGroupResp, ...result]);
          });
        } else {
          resolve(priceListGroupResp);
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findAndSaveManufacturer = async (manufacturers, business) =>
  new Promise((resolve, reject) => {
    try {
      findByQuery({
        query: { name: { $in: manufacturers } },
      }).then((manufacturerResp) => {
        let manufacturer = manufacturers.filter(
          (x) => !manufacturerResp.map((t) => t.name).includes(x)
        );
        if (manufacturer.length > 0) {
          createMultipleManufacturer(manufacturer, business).then((result) => {
            resolve([...manufacturerResp, ...result]);
          });
        } else {
          resolve(manufacturerResp);
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findAndSaveBrands = async (brands, business, manufacturer, brandMap) =>
  new Promise((resolve, reject) => {
    try {
      findBrand(brands).then((brandResponse) => {
        let brand = brands.filter(
          (x) => !brandResponse.map((t) => t.name).includes(x)
        );
        let toBeSaved = brand.map((x) => ({
          name: x,
          manufacturer: manufacturer.find(
            (y) => y.name === brandMap.get(x).value
          )._id,
          active: true,
          business: business,
        }));

        if (brand.length > 0) {
          createMultipleBrand(toBeSaved, business).then((result) => {
            resolve([...brandResponse, ...result]);
          });
        } else {
          resolve(brandResponse);
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
const validate = async (data, existingNames, hsnNames) =>
  new Promise((resolve, reject) => {
    try {
      let brandMap = new Map();

      for (let index = 0; index < data.length; index++) {
        const e = data[index];

        if (existingNames.includes(e["Product Name"].trim())) {
          e.remarks = "Failed";
          e.reason = "Duplicate";
        }
        let temp = brandMap.get(e["Brand"]);

        if (!e["Product Name"] || e["Product Name"] === "") {
          e.remarks = "Failed";
          e.reason = "Name missing";
        }
        if (!e["Brand"] || e["Brand"] === "") {
          e.remarks = "Failed";
          e.reason = "Brand missing";
        }
        if (!e["Category"] || e["Category"] === "") {
          e.remarks = "Failed";
          e.reason = "Category missing";
        }
        if (!e["Manufacturer"] || e["Manufacturer"] === "") {
          e.remarks = "Failed";
          e.reason = "Manufacturer missing";
        }
        if (!e["Pricelist Group"] || e["Pricelist Group"] === "") {
          e.remarks = "Failed";
          e.reason = "Pricelist Group missing";
        }
        if (
          !hsnNames.includes(e["HSN Number"]) ||
          !e["HSN Number"] ||
          e["HSN Number"] === ""
        ) {
          e.remarks = "Failed";
          e.reason = "HSN Number missing";
        }
        if (!e["Notify Before"] || e["Notify Before"] === "") {
          e.remarks = "Failed";
          e.reason = "Notify Before expiry missing";
        }
        if (temp && temp.value != e["Manufacturer"]) {
          e.remarks = "Failed";
          e.reason = "Brand and Manufacturer name conflict.";
          e.brandError = true;
        }
        if (e.remarks) {
          if (temp && e.brandError) {
            let obj = data[temp.index];
            obj.remarks = "Failed";
            obj.reason = "Brand and Manufacturer name conflict.";
            data[temp.index].error = true;
          }
          e.error = true;
        }
        brandMap.set(e.Brand, { index: index, value: e.Manufacturer });
      }
      resolve({
        errorData: data.filter((x) => x.remarks),
        toBeSaved: data.filter((x) => !x.remarks),
        brandMap: brandMap,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const saveProducts = async (products) =>
  new Promise((resolve, reject) => {
    try {
      Product.insertMany(products, (err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          Product.populate(
            resp,
            [
              { path: "brand" },
              { path: "category" },
              { path: "priceListGroup" },
              { path: "manufacturer" },
              { path: "hsn" },
              { path: "tax" },
            ],
            (error, response) => {
              if (error) {
                console.error(error);
                reject(error);
              }
              if (response) {
                resolve(response);
              } else {
                reject({
                  message:
                    "Unable to populate! Please refresh the application again",
                });
              }
            }
          );
        } else {
          reject({ message: "Unable to create!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const findProduct = async (names, business) =>
  new Promise((resolve, reject) => {
    try {
      Product.find(
        { name: { $in: Array.from(names) }, business: business },
        (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid product" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.brandCount = async (req, res) => {
  try {
    let queryObj = new Object();

    if (req.params.business) {
      queryObj.business = req.params.business;
    }
    brandCount(queryObj)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const brandCount = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Product.aggregate(
        [
          {
            $match: queryObj,
          },
          {
            $lookup: {
              from: "brands",
              localField: "brand",
              foreignField: "_id",
              as: "brand",
            },
          },
          {
            $group: {
              _id: "_id",
              brands: {
                $addToSet: "$brand",
              },
            },
          },
          {
            $unwind: "$brands",
          },
          {
            $group: {
              _id: null,
              brandCount: {
                $sum: 1,
              },
            },
          },
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
      console.error(e);
      reject(e);
    }
  });

exports.downloadTemplate = async (req, res) => {
  try {
    readFile().then((response) => {
      res.setHeader("Content-Length", response.binary.length);
      res.setHeader("Content-Type", "xlsx");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=template.xlsx`
      );
      res.write(response.binary, "binary");
      res.end();
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const readFile = async () =>
  new Promise((resolve, reject) => {
    try {
      fs.readFile(
        "src/assets/template.xlsx",
        { encoding: "binary" },
        (error, response) => {
          if (error) {
            reject(error);
          }
          if (response) {
            resolve({ binary: response, path: "template.xlsx" });
          } else {
            reject({ message: "File not found!" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.changeReturnableStatus = async (req, res) => {
  try {
    Product.findByIdAndUpdate(
      req.body._id,
      { $set: { returnable: req.body.returnable } },
      { new: true },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (response) {
          let resp = JSON.parse(JSON.stringify(response));
          return res
            .status(200)
            .json({ _id: resp._id, returnable: resp.returnable });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchImage = async (req, res) => {
  try {
    Product.findById(req.query.id, { image: 1 }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      let resp = JSON.parse(JSON.stringify(response));
      var img = req.query.imageId
        ? resp.image.find((x) => x._id === req.query.imageId)
        : resp.image.find((x) => x.default) || resp.image[0];
      if (img) {
        var image = Buffer.from(img.image, "base64");
        res.writeHead(200, {
          "Content-type": img.mimType,
          "Content-Length": image.length,
        });
        res.end(image);
      } else {
        fs.readFile("src/assets/products.png", (err, content) => {
          if (err) {
            res.writeHead(400, { "Content-type": "text/html" });
            console.log(err);
            res.end({ message: "No such image" });
          } else {
            //specify the content type in the response will be an image
            res.writeHead(200, { "Content-type": "image/png" });
            res.end(content);
          }
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

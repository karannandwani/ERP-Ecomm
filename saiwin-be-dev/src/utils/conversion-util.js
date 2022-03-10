const mongoose = require("mongoose");
exports.bodyToTaxObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        percentage: body.percentage,
      };
      if (!body._id) {
        obj.business = body.business;
        if (body.hsn) {
          obj.hsn = body.hsn;
        }
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToProductObject = async (body, imagesToBeSaved) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        brand: body.brand,
        sku: body.sku,
        basepackCode: body.basepackCode,
        hsn: body.hsn,
        description: body.description,
        category: body.category,
        priceListGroup: body.priceListGroup,
        manufacturer: body.manufacturer,
        qtyPerCase: body.qtyPerCase,
        notifyBeforeExpiry: body.notifyBeforeExpiry,
        image: imagesToBeSaved,
        business: body.business,
        tax: body.tax,
        returnable: body.returnable,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToProductFilterObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      let query = body;
      if (!query.business) {
        reject({ message: "Provide business!" });
      }
      let name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      if (query.excludeIds) {
        queryObj._id = {
          $nin: query.excludeIds.map((x) => mongoose.Types.ObjectId(x)),
        };
      }

      if (query.business) {
        queryObj.business = query.business;
      }

      let limit = 1000,
        skip = 0;

      if (
        query.pageNo &&
        query.pageNo !== null &&
        query.pageSize &&
        query.pageSize !== null
      ) {
        limit = query.pageSize;
        skip = query.pageNo * query.pageSize;
      }
      resolve({ query: queryObj, name: name, limit: limit, skip: skip });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.bodyToHsnObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        hsn: body.hsn,
        description: body.description,
        business: body.business,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToCountryObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToTargetObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        business: body.business,
        salesPerson: body.salesPerson,
        target: body.target,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToStateObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
      };
      if (!body._id) {
        obj.country = body.country;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToStateFilterObj = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (query.name) {
        queryObj.name = new RegExp(escape(query.name), "gi");
      }
      if (query.country) {
        queryObj.country = query.country;
      }
      let limit = 1000;
      let skip = 0;
      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageSize) * Number(query.pageNo);
      }
      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [{ path: "country" }],
      });

      resolve(queryObj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToFacilityObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        address: body.address,
        business: body.business,
        suppliers: body.suppliers,
        areas: body.areas,
        type: body.type,
        shortName: body.shortName,
        country: body.country,
        state: body.state,
      };
      if (body.location) {
        obj.location = {
          type: "Point",
          coordinates: body.location.coordinates,
        };
      }
      if (!body._id) {
        obj.billNo = 1;
        obj.returnNo = 1;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToFilterObj = async (query) =>
  new Promise((resolve, reject) => {
    try {
      if (!query.business) {
        reject({ message: "Provide business" });
      }
      let findObj = new Object();
      findObj.business = query.business;
      if (query.type === "Sup-Cre") {
        findObj.supplierDoc = {
          $eq: null,
        };
      } else if (query.type === "Sup-Upd") {
        findObj["$or"] = [
          {
            supplierDoc: {
              $eq: null,
            },
          },
          {
            supplierDoc: {
              $eq: mongoose.Types.ObjectId(query.supplier),
            },
          },
        ];
        findObj.suppliers = { $ne: mongoose.Types.ObjectId(query.supplier) };
      }
      if (query.active) {
        findObj.active = query.active;
      }
      if (query.name) {
        findObj.name = new RegExp(this.escapeRegex(query.name), "gi");
      }

      let limit = 1000;
      let skip = 0;
      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageSize) * Number(query.pageNo);
      }
      resolve({
        query: findObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [
          { path: "country" },
          { path: "state" },
          { path: "suppliers" },
          { path: "areas.area" },
        ],
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToSupplierObject = async (body, facility) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.business) {
        reject({ message: "Provide business" });
      }
      if (!body.email || !body.name) {
        console.error("Please provide email and name!");
        reject({
          message: "Please provide email and name!",
        });
      }
      let obj = {
        name: body.name,
        email: body.email,
        facility: body.facility,
        phone: body.phone,
        shortName: body.shortName,
      };
      if (facility) {
        obj.country = facility.country;
        obj.state = facility.state;
      }
      if (!body._id) {
        obj.business = body.business;
        obj.orderNo = 1;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToBrandObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        manufacturer: body.manufacturer,
        business: body.business,
      };
      resolve(obj);
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToBrandFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      let name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      queryObj.business = query.business;
      if (query.active) {
        queryObj.active = true;
      }

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({ query: queryObj, name: name, limit: limit, skip: skip });
    } catch (e) {
      reject(e);
    }
  });
exports.bodyToSalesPersonObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      if (query.name)
        queryObj.name = new RegExp(
          this.escapeRegex(query.name ? query.name : ""),
          "gi"
        );

      queryObj["businessRoleMap.business"] = mongoose.Types.ObjectId(
        query.business
      );

      resolve(queryObj);
    } catch (e) {
      reject(e);
    }
  });

exports.queryToTaxFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      queryObj.business = query.business;
      if (query.hsn) {
        queryObj.hsn = query.hsn;
      } else {
        queryObj.hsn = { $eq: null };
      }
      if (query.name) {
        queryObj.name = new RegExp(this.escapeRegex(query.name), "gi");
      }
      resolve(queryObj);
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToBusinessObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        country: body.country,
        state: body.state,
        phone: body.phone,
        address: body.address,
      };
      if (!body._id) {
        obj.email = body.email;
      }
      resolve(obj);
    } catch (e) {
      reject(e);
    }
  });

exports.queryToInventoryFilterObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!body.business) {
        reject({ message: "Provide business!" });
      }
      let name = new RegExp(this.escapeRegex(body.name ? body.name : ""), "gi");

      if (body.stockOut) {
        queryObj.products = { $eq: null };
      }
      if (body.type && body.facilities) {
        queryObj["$or"] = [
          {
            facility: {
              $in: body.facilities.map((x) => mongoose.Types.ObjectId(x)),
            },
          },
          {
            type: "Business",
          },
        ];
      } else if (body.type) {
        queryObj.type = {
          $eq: "Business",
        };
      } else if (body.facilities) {
        queryObj.facility = {
          $in: body.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.business) {
        queryObj.business = body.business;
      }
      if (body.facility) {
        queryObj.facility = mongoose.Types.ObjectId(body.facility);
      }
      let limit = 1000,
        skip = 0;

      if (body.pageNo && body.pageSize) {
        limit = Number(body.pageSize);
        skip = Number(body.pageNo) * Number(body.pageSize);
      }
      if (body.includeIds && body.includeIds.length > 0) {
        queryObj.product = {
          $in: body.includeIds.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      resolve({ query: queryObj, name: name, limit: limit, skip: skip });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToBillFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj;
      if (query.facilities) {
        queryObj = {
          $and: [
            {
              suppliers: {
                $in: query.facilities.map((x) => mongoose.Types.ObjectId(x)),
              },
            },
            {
              type: "Bill",
            },
          ],
        };
      } else if (query.facility) {
        queryObj = {
          $and: [
            {
              suppliers: mongoose.Types.ObjectId(query.facility),
            },
            {
              type: "Bill",
            },
          ],
        };
      } else {
        queryObj = {
          $and: [
            {
              business: mongoose.Types.ObjectId(query.business),
            },
            {
              type: "Bill",
            },
          ],
        };
      }

      if (query.fromDate && query.toDate) {
        let toDate = new Date(query.toDate);
        toDate.setHours(23);
        toDate.setMinutes(59);
        let minId = mongoose.Types.ObjectId(
          Math.floor(new Date(query.fromDate) / 1000).toString(16) +
            "0000000000000000"
        );

        let maxId = mongoose.Types.ObjectId(
          Math.floor(toDate / 1000).toString(16) + "0000000000000000"
        );
        queryObj["$and"].push({ _id: { $gte: minId } });
        queryObj["$and"].push({ _id: { $lte: maxId } });
      } else {
        let tempDate = new Date();
        tempDate.setMonth(tempDate.getMonth() - 1);

        let minId = mongoose.Types.ObjectId(
          Math.floor(tempDate / 1000).toString(16) + "0000000000000000"
        );

        queryObj["$and"].push({ _id: { $gte: minId } });
      }

      let name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }
      resolve({ query: queryObj, name: name, limit: limit, skip: skip });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToOrderFilterObject = async (query, supplier) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      let queryAddOn;
      queryAddOn = [
        {
          $match: {
            type: {
              $ne: "Bill",
            },
          },
        },
      ];
      if (query.facility) {
        if (query.filter === "Procurement") {
          queryObj.facility = mongoose.Types.ObjectId(query.facility);
        } else {
          queryObj.suppliers = supplier ? supplier._id : null;
          queryAddOn = [
            {
              $lookup: {
                from: "facilities",
                localField: "suppliers",
                foreignField: "supplierDoc",
                as: "sup-facility",
              },
            },
            {
              $unwind: "$sup-facility",
            },
            {
              $lookup: {
                from: "inventories",
                let: {
                  fId: "$sup-facility._id",
                  pId: "$products.product",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$$fId", "$facility"],
                          },
                          {
                            $eq: ["$$pId", "$product"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      products: 1,
                    },
                  },
                ],
                as: "inventory",
              },
            },
            {
              $unwind: {
                path: "$inventory",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                "pro.qtyAvail": {
                  $reduce: {
                    input: "$inventory.products",
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        {
                          $add: [
                            "$$this.noOfProduct",
                            {
                              $multiply: [
                                "$$this.noOfCase",
                                "$$this.qtyPerCase",
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ];
        }
      } else {
        queryObj.business = mongoose.Types.ObjectId(query.business);
      }
      queryObj.type = {
        $ne: "Bill",
      };

      if (query.fromDate && query.toDate) {
        let toDate = new Date(query.toDate);
        toDate.setHours(23);
        toDate.setMinutes(59);
        let minId = mongoose.Types.ObjectId(
          Math.floor(new Date(query.fromDate) / 1000).toString(16) +
            "0000000000000000"
        );

        let maxId = mongoose.Types.ObjectId(
          Math.floor(toDate / 1000).toString(16) + "0000000000000000"
        );
        queryObj["$and"] = [{ _id: { $gte: minId } }, { _id: { $lte: maxId } }];
      }

      let name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }
      resolve({
        query: queryObj,
        name: name,
        limit: limit,
        skip: skip,
        queryAddOn: queryAddOn,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToReturnFilterObject = async (query, suppliers) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();

      if (query.business) {
        queryObj.business = mongoose.Types.ObjectId(query.business);
      }
      if (query.facilities && query.facilities.length > 0) {
        queryObj["$or"] = [
          {
            facility: {
              $in: query.facilities.map((x) => mongoose.Types.ObjectId(x)),
            },
          },
          {
            suppliers: {
              $in: suppliers.map((x) => mongoose.Types.ObjectId(x._id)),
            },
          },
        ];
      }

      resolve({
        query: queryObj,
        limit: 1000,
        skip: 0,
        statusFilter: {},
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToReturnFilterObject = async (query, supplier) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();

      if (query.business) {
        queryObj.business = mongoose.Types.ObjectId(query.business);
      } else {
        if (query.type === "Procurement") {
          queryObj.facility = mongoose.Types.ObjectId(query.facility);
        } else {
          queryObj.suppliers = supplier ? supplier._id : null;
        }
      }

      if (query.product) {
        queryObj.product = mongoose.Types.ObjectId(query.productId);
      }

      if (query.draft) {
        queryObj.draft = true;
      } else {
        queryObj.draft = false;
      }

      let limit = 1000,
        statusFilter;
      let skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }
      if (queryObj.suppliers) {
        statusFilter = {
          $and: [
            {
              "status.name": {
                $ne: "Accepted",
              },
            },
            {
              "status.name": {
                $ne: "Rejected",
              },
            },
          ],
        };
      } else {
        statusFilter = {
          "status.name": {
            $ne: "Accepted",
          },
        };
      }

      resolve({
        query: queryObj,
        limit: limit,
        skip: skip,
        statusFilter: statusFilter,
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.bodyToStockMismatchReasonObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        facility: body.facility,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryToStockMismatchReasonFilterObj = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (query.name) {
        queryObj.name = new RegExp(this.escapeRegex(query.name), "gi");
      }
      queryObj.facility = { $eq: mongoose.Types.ObjectId(query.facility) };
      resolve(queryObj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.bodyToManufacturerObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
      };
      if (!body._id) {
        obj.business = body.business;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToManufacturerFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      queryObj.business = query.business;
      if (query.active) {
        queryObj.active = true;
      }

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToBeatObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        areas: body.areas,
        location: {
          type: body.location.type,
          coordinates: JSON.parse(body.location.coordinates),
        },
      };
      if (!body._id) {
        obj.business = body.business;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToOrderFeedbackObject = async (body, image, order, user) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        order: body.orderId,
        facility: order.suppliers,
        business: order.business,
        user: user._id,
        rating: body.rating,
        comment: body.comment,
        image: image,
      };

      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToUserObject = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let newObj = {
        name: obj.name,
        email: obj.email,
        password: obj.password,
        phone: obj.phone,
        image: obj.image,
        mimType: obj.mimType,
        active: true,
        businessRoleMap: [obj.businessRoleMap],
      };
      if (obj.facilityId) {
        newObj.facilityId = obj.facilityId;
      }
      resolve(newObj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToBeatFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      queryObj.business = query.business;
      if (query.active) {
        queryObj.active = true;
      }

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
exports.bodyToPricelistObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
      };
      if (!body._id) {
        obj.business = body.business;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToPricelistFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      queryObj.business = query.business;
      if (query.active) {
        queryObj.active = true;
      }

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToBusinessFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      queryObj.email = new RegExp(query.name ? "^" + query.name : "", "i");
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToCountryFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToTargetFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }
      queryObj.business = query.business;
      queryObj.salesPerson = query.salesPerson;

      resolve(queryObj);
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToVehicleObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        model: body.model,
      };
      if (!body._id) {
        obj.business = body.business;
        obj.facility = body.facility;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToVehicleFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      if (query.facilities) {
        queryObj.facility = {
          $in: query.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }

      queryObj.business = query.business;
      if (query.active) {
        queryObj.active = true;
      }
      if (query.facility) {
        queryObj.facility = mongoose.Types.ObjectId(query.facility);
      }
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToNormFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();

      if (query.facility) {
        queryObj.facility = mongoose.Types.ObjectId(query.facility);
      }
      if (query.facilities) {
        queryObj.facility = {
          $in: query.facilities.map((x) =>
            mongoose.Types.ObjectId(query.facility)
          ),
        };
      }
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }
      if (query.business) {
        queryObj.business = mongoose.Types.ObjectId(query.business);
      }
      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [{ path: "product" }],
      });
    } catch (e) {
      console.error(error);
      reject(e);
    }
  });

exports.bodyToInventoryLedgerObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }
      queryObj.business = query.business;

      if (query.facility) {
        queryObj.facility = mongoose.Types.ObjectId(query.facility);
      }
      if (query.facilities) {
        queryObj.facility = {
          $in: query.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      resolve({
        query: queryObj,
        populate: [{ path: "product" }],
      });
    } catch (e) {
      console.error(error);
      reject(e);
    }
  });

exports.bodyToExpiryCountObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }
      queryObj.business = query.business;

      if (query.facility) {
        queryObj.facility = mongoose.Types.ObjectId(query.facility);
      }

      resolve(queryObj);
    } catch (e) {
      console.error(error);
      reject(e);
    }
  });

exports.bodyToCategoryFilterObject = async (req) =>
  new Promise((resolve, reject) => {
    try {
      let body = req;
      if (!body.business) {
        reject({
          message: "Provide business Id",
        });
      }

      let findObj = new Object();
      if (body.business) {
        findObj.business = body.business;
      }

      if (body.active) {
        findObj.active = body.active;
      }
      if (body.name) {
        findObj.searchCategory = new RegExp(this.escapeRegex(body.name), "i");
      }
      if (body.parentCategory) {
        findObj.parentCategory = body.parentCategory;
      }

      if (body.flat) {
        findObj.parentCategory = null;
      }
      let limit = 1000;
      let skip = 0;
      if (body.pageNo != null && body.pageSize != null) {
        limit = Number(body.pageSize);
        skip = Number(body.pageSize) * Number(body.pageNo);
      }
      let project = {};
      if (body.type === "ecom") {
        project["icon.image"] = 0;
        project["image.image"] = 0;
      }

      resolve({
        query: findObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [{ path: "parentCategory" }],
        project: project,
      });
    } catch (e) {
      console.error(error);
      reject(e);
    }
  });

exports.bodyToUserFilterObject = async (req) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      let query = req;

      if (query.name) {
        queryObj.name = new RegExp(this.escapeRegex(query.name), "gi");
      }

      if (query.excludeIds) {
        queryObj._id = {
          $nin: query.excludeIds.map((x) => mongoose.Types.ObjectId(x)),
        };
      }

      if (query.businessId) {
        queryObj["businessRoleMap.business"] = mongoose.Types.ObjectId(
          query.businessId
        );
      }

      if (query.business) {
        queryObj["businessRoleMap.business"] = mongoose.Types.ObjectId(
          query.business
        );
      }

      if (!query.type && query.facilities) {
        queryObj.facilityId = {
          $in: query.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }

      if (query.facilityId) {
        queryObj.facilityId = mongoose.Types.ObjectId(query.facilityId);
      }
      let limit = 1000,
        skip = 0;

      if (query.pageNo !== null && query.pageSize !== null) {
        limit = query.pageSize;
        skip = query.pageNo * query.pageSize;
      }

      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [
          { path: "businessRoleMap.business" },
          { path: "businessRoleMap.roles" },
        ],
      });
    } catch (e) {
      console.error(error);
      reject(e);
    }
  });

exports.bodyToSupplierFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.name = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );

      queryObj.business = query.business;

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: queryObj,
        project: null,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [{ path: "facility" }],
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToCategoryObject = async (body, searchCategory) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        active: body.active,
        description: body.description,
        notifyBeforeExpiry: body.notifyBeforeExpiry,
        parentCategory: body.parentCategory,
        icon: body.icon,
      };
      if (!body._id) {
        obj.business = body.business;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToPolicyObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let accessPolicies = [];
      for (let index = 0; index < body.action.length; index++) {
        const action = body.action[index];
        for (let index1 = 0; index1 < body.resource.length; index1++) {
          const resource = body.resource[index1];
          let obj = {
            roleId: body.roleId,
            action: action,
            resource: resource,
            businessId: body.businessId,
          };
          accessPolicies.push(obj);
        }
      }
      resolve(accessPolicies);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToPolicyFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      if (!query.business) {
        reject({
          message: "Provide business Id",
        });
      }

      let queryObj = new Object();
      queryObj.businessId = query.business;
      if (query.role) {
        queryObj.role = query.role;
      }
      if (query.action) {
        queryObj.action = query.action;
      }
      if (query.resource) {
        queryObj.resource = query.resource;
      }
      // let limit = 100;
      // let skip = 0;
      // if (query.pageNo && query.pageSize) {
      //   limit = Number(req.query.pageSize);
      //   skip = Number(req.query.pageSize) * Number(req.query.pageNo);
      // }
      // size: {
      //   skip: skip,
      //   limit: limit,
      // },
      resolve({
        query: queryObj,
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToRoleObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        businessId: body.businessId,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToRoleFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let findObj = new Object();
      if (query.businessId) {
        findObj["$or"] = [
          {
            businessId: query.businessId,
          },
          {
            businessId: null,
          },
        ];
      }
      if (query.facilityId) {
        findObj.name = {
          $nin: ["Super Admin", "Business", "Facility"],
        };
      } else if (query.salesManager) {
        findObj.name = { $eq: "Sales Person" };
      } else {
        findObj.name = { $ne: "Super Admin" };
      }

      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }

      resolve({
        query: findObj,
        project: null,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
exports.bodyToMenuObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {};
      if (body.title) obj.title = body.title;
      if (body.url) obj.url = body.url;
      if (body.icon) obj.icon = body.icon;
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToMenuRoleMapObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        roleId: body.roleId,
        menu: body.menu,
        businessId: body.businessId,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyMenuRoleFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let findObj = new Object();

      if (query.businessId) {
        findObj.businessId = query.businessId;
      }
      if (query.roleId) {
        findObj.roleId = query.roleId;
      }
      let limit = 1000;
      let skip = 0;
      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageSize) * Number(query.pageNo);
      }

      resolve({
        query: findObj,
        size: {
          skip: skip,
          limit: limit,
        },
        populate: [{ path: "menu" }, { path: "roleId" }],
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToInventoryFilterForReturn = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let query = new Object();
      let matchObj = new Object();
      query.facility = mongoose.Types.ObjectId(body.facility);
      matchObj.business = body.business;
      if (body.excludeIds && body.excludeIds.length > 0) {
        matchObj._id = {
          $nin: body.excludeIds.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      matchObj.name = new RegExp(
        this.escapeRegex(body.name ? body.name : ""),
        "gi"
      );
      query.supplier = mongoose.Types.ObjectId(body.supplier);
      resolve({ ...query, match: matchObj });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.validateUserLoginRequest = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!(body.email || body.phone) && !(body.password || body.otp)) {
        console.error("Provide email or Phone Number and Password!!!");
        reject({
          message: "Provide email or Phone Number and Password!!!",
        });
      }
      if (!(body.email || body.phone)) {
        console.error("Email or Phone Number field should not be blank.");
        reject({
          message: "Email or Phone Number field should not be blank.",
        });
      }
      if (!(body.password || body.otp)) {
        console.error("Password field should not be blank.");
        reject({
          message: "Password field should not be blank.",
        });
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToMultipleProduct = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      if (!obj.file || obj.file == "") {
        reject({ message: "provide file!" });
        return;
      }
      if (!obj.business) {
        reject({ message: "provide business!" });
        return;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.bodyToMultipleManufacturer = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      let manufacturers = [];
      for (let index = 0; index < obj.length; index++) {
        const b = obj[index];
        let x = {
          name: b,
          business: business,
          active: true,
        };
        manufacturers.push(x);
      }
      resolve(manufacturers);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToMultiplePricelist = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      let pricelistgroups = [];
      for (let index = 0; index < obj.length; index++) {
        const b = obj[index];
        let x = {
          name: b,
          business: business,
          active: true,
        };
        pricelistgroups.push(x);
      }
      resolve(pricelistgroups);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToMultipleHsn = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      let hsnList = [];
      for (let index = 0; index < obj.length; index++) {
        const b = obj[index];
        let x = {
          hsn: b,
          business: business,
        };
        hsnList.push(x);
      }
      resolve(hsnList);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToMultipleCategory = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      let categories = [];
      for (let index = 0; index < obj.length; index++) {
        const b = obj[index];
        let x = {
          name: b,
          business: business,
          active: true,
          parentCategory: null,
          searchCategory: [b],
        };
        categories.push(x);
      }
      resolve(categories);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToEffectRequest = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        query: body.query,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToLeadObject = async (body, imageResponse, user) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();
      obj.name = body.name;
      obj.business = body.business;
      obj.storeLocation = body.storeLocation;
      obj.address = body.address;
      obj.phone = body.phone;
      obj.storeLogo = body.storeLogo;
      obj.mimType = body.mimType;
      obj.user = user._id;
      obj.storeLogo = imageResponse.image;
      obj.mimType = imageResponse.mimType;

      if (!body._id) {
        obj.status = "Warm";
        obj.email = body.email;
        obj.assignTo = body.assignTo ? body.assignTo : user._id;
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToComment = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.status || !body.followUpDate) {
        reject({ message: "Please provide minimum required details." });
      }

      let obj = new Object();
      obj["$set"] = { status: body.status };
      if (body.status !== "Converted") {
        obj["$push"] = {
          comments: {
            comment: body.comment,
            date: new Date(),
            followUpDate: body.followUpDate,
            salesPersonLocation: body.salesPersonLocation,
          },
        };
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateNormRequest = async (body) =>
  new Promise((resolve, reject) => {
    if (body.length < 1) {
      reject({
        message: "Unable to process!",
      });
      return;
    } else {
      resolve(true);
    }
  });

exports.bodyToEffectVariableFindObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!body.business) {
        reject({ message: "Please provide a valid business" });
      }
      queryObj.business = body.business;
      let skip = 0,
        limit = 20;
      if (body.pageNo && body.pageSize) {
        skip = Number(body.pageNo) * Number(body.pageSize);
        limit = Number(body.pageSize);
      }
      resolve({ query: queryObj, skip: skip, limit: limit });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToSchemeVariableFindObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!body.business) {
        reject({ message: "Please provide a valid business" });
      }
      queryObj.business = body.business;
      let skip = 0,
        limit = 20;
      if (body.pageNo && body.pageSize) {
        skip = Number(body.pageNo) * Number(body.pageSize);
        limit = Number(body.pageSize);
      }
      resolve({ query: queryObj, skip: skip, limit: limit });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToSchemeVariableObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();
      if (!body.business) {
        reject({ message: "Provide a business" });
      }
      obj.business = body.business;
      obj.name = body.name;
      obj.query = body.query;
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.queryObjForUser = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let findObj = {
        $or: [],
      };
      if (obj.phone && obj.phone !== "") {
        findObj.$or.push({ phone: obj.phone });
      }
      if (obj.email && obj.email !== "") {
        findObj.$or.push({ email: obj.email });
      }
      resolve(findObj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToCouponObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        name: body.name,
        validFrom: body.validFrom,
        validTill: body.validTill,
        active: body.active,
        discountType: body.discountType,
        discountAmount: body.discountAmount,
        minCartValue: body.minCartValue,
        ceilingValue: body.ceilingValue,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.couponFetchObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();
      if (query.name) {
        obj.name = new RegExp(
          this.escapeRegex(query.name ? query.name : ""),
          "gi"
        );
      }
      if (query.active) {
        obj.active = query.active;
      }
      let skip = 0,
        limit = 20;
      if (query.pageNo && query.pageSize) {
        skip = Number(query.pageNo) * Number(query.pageSize);
        limit = Number(query.pageSize);
      }
      if (query.type) {
        obj.validFrom = { $lte: new Date() };
        obj.validTill = { $gte: new Date() };
      }

      resolve({ queryObj: obj, skip: skip, limit: limit });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToInventoryfetchObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();

      if (body.brands && body.brands.length > 0) {
        obj.brand = {
          $in: body.brands.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.categories && body.categories.length > 0) {
        obj.category = {
          $in: body.categories.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.manufacturers && body.manufacturers.length > 0) {
        obj.manufacturer = {
          $in: body.manufacturers.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.name) {
        obj.name = new RegExp(
          this.escapeRegex(body.name ? body.name : ""),
          "gi"
        );
      }
      if (obj._id) {
        obj._id = mongoose.Types.ObjectId(obj._id);
      }
      obj.business = body.business;
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToKeywordFilterObject = async (query) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (!query.business) {
        reject({ message: "Provide business!" });
      }

      queryObj.itemName = new RegExp(
        this.escapeRegex(query.name ? query.name : ""),
        "gi"
      );
      queryObj.business = query.business;
      let limit = 1000,
        skip = 0;

      if (query.pageNo && query.pageSize) {
        limit = Number(query.pageSize);
        skip = Number(query.pageNo) * Number(query.pageSize);
      }
      resolve({
        query: queryObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToAddressObject = async (body, user) =>
  new Promise((resolve, reject) => {
    try {
      let address = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        alternativePhone: body.alternativePhone,
        street1: body.street1,
        street2: body.street2,
        city: body.city,
        pincode: body.pincode,
        state: body.state,
        country: body.country,
        default: body.default,
        user: user._id,
      };
      resolve(address);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToCartUpdateObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!(body.address || body.payment)) {
        reject({ message: "Nothing to update!" });
      }
      let updateObj = new Object();
      if (body.address) {
        updateObj.address = body.address;
      }
      if (body.payment) {
        console.log(body.payment);
        updateObj.payment = body.payment;
      }
      if (body.payment) {
        updateObj.payment = body.payment;
      }
      resolve(updateObj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToEcoomerceOrderFettchObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();
      obj.type = "E-COM";
      if (body.facilities) {
        obj.suppliers = {
          $in: body.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.business) {
        obj.business = mongoose.Types.ObjectId(body.business);
      }
      if (body.user) {
        obj.createdBy = mongoose.Types.ObjectId(body.user);
      }
      if (body.driver) {
        obj.driver = mongoose.Types.ObjectId(body.driver);
      }
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToFeedbackFilterObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let queryObj = new Object();
      if (body.business) {
        queryObj.business = body.business;
      }
      if (body.facility) {
        queryObj.facility = body.facility;
      }
      if (!body.type && body.facilities) {
        queryObj.facility = {
          $in: body.facilities.map((x) => mongoose.Types.ObjectId(x)),
        };
      }
      if (body.order) {
        queryObj.order = body.order;
      }
      resolve({
        body: queryObj,
      });
    } catch (e) {
      reject(e);
    }
  });

exports.bodyToHsnFetchObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.business) {
        reject({
          message: "Provide business Id",
        });
        return;
      }
      let findObj = new Object();

      if (body.business) {
        findObj.business = body.business;
      }
      findObj.hsn = new RegExp(
        this.escapeRegex(body.hsn ? body.hsn : ""),
        "gi"
      );
      let limit = 1000;
      let skip = 0;
      if (body.pageNo && body.pageSize) {
        limit = Number(body.pageSize);
        skip = Number(body.pageSize) * Number(body.pageNo);
      }
      resolve({
        query: findObj,
        size: {
          skip: skip,
          limit: limit,
        },
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToSlideObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let slide = {
        name: body.name,
        business: body.business,
        image: body.image,
        type: body.type,
        aspectRatio: body.aspectRatio,
        redirectData: {
          id: mongoose.Types.ObjectId(body.redirectData.id),
          type: body.redirectData.type,
        },
      };
      resolve(slide);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToLandingPageObject = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = new Object();
      obj.type = body.type;
      obj.order = body.order;
      obj.business = body.business;
      obj.active = body.active;
      obj.viewType = body.viewType;
      let temp = false;
      if (["Category", "Product"].includes(body.type)) {
        temp = true;
        obj.dataQuery = {
          type: body.dataQuery.type,
          query: JSON.parse(body.dataQuery.query),
          limit: body.dataQuery.limit,
        };
      }
      if (["Image", "Carousel"].includes(body.type)) {
        temp = true;
        obj.slideImages = body.slideImages.map((x) =>
          mongoose.Types.ObjectId(x)
        );
      }
      if (temp) {
        resolve(obj);
      } else {
        reject({ message: "Provide all details!" });
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.bodyToCouponFetchObject = async (body) =>
  new Promise((resolve, reject) => {
    let obj = new Object();

    obj.business = body.business;
    if (body.type) {
      obj.validFrom = { $gte: new Date() };
      obj.validTill = { $lte: new Date() };
    }
    if (body.name) {
      obj.name = new RegExp(this.escapeRegex(body.name || ""), "gi");
    }
    resolve({ queryObj: obj });
  });

exports.bodyToStaticData = async (body) =>
  new Promise((resolve, reject) => {
    try {
      let obj = {
        key: body.key,
        value: body.value,
        business: body.business,
      };
      resolve(obj);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

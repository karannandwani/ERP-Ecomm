var phoneRegex = /^\d{10}$/;
var emailRegex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

exports.addCouponValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.discountType) {
        reject({ message: "Discount Type is required!" });
        return;
      }
      if (!body.discountAmount) {
        reject({ message: "Discount Amount is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addManufacturerValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addCategoryValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (body.notifyBeforeExpiry && isNaN(body.notifyBeforeExpiry)) {
        reject({ message: "Please enter a valid notifyBeforeExpiry!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addBeatValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addPriceListValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addProductValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.brand) {
        reject({ message: "Brand is required!" });
        return;
      }
      if (!body.category) {
        reject({ message: "Category is required!" });
        return;
      }
      if (!body.manufacturer) {
        reject({ message: "Manufacturer is required!" });
        return;
      }
      if (!body.hsn) {
        reject({ message: "Hsn is required!" });
        return;
      }

      if (body.qtyPerCase && isNaN(body.qtyPerCase)) {
        reject({ message: "Please enter a valid Qty per case!" });
        return;
      }
      if (body.notifyBeforeExpiry && isNaN(body.notifyBeforeExpiry)) {
        reject({ message: "Please enter a valid notifyBeforeExpiry!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addBrandValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.manufacturer) {
        reject({ message: "Manufacturer is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addCommentValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.orderId) {
        reject({ message: "OrderId is required!" });
        return;
      }
      if (!body.rating) {
        reject({ message: "Rating is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addFacilityValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body._id && body.name === "Master Warehouse") {
        reject({ message: "Please choose a different name!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.shortName) {
        reject({ message: "ShortName is required!" });
        return;
      }
      if (!body.country) {
        reject({ message: "Country is required!" });
        return;
      }
      if (!body.state) {
        reject({ message: "State is required!" });
        return;
      }
      if (!body.type) {
        reject({ message: "Type is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addHsnValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.hsn) {
        reject({ message: "Hsn is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body._id && !body.percentage) {
        reject({ message: "Percentage is required!" });
        return;
      }
      if (body.percentage && isNaN(body.percentage)) {
        reject({ message: "Please enter a valid Percentage!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addSupplierValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      if (!body.email) {
        reject({ message: "Email is required!" });
        return;
      }
      if (body.email && !body.email.match(emailRegex)) {
        reject({ message: "Please enter a valid email!" });
        return;
      }
      if (body.phone && !body.phone.match(phoneRegex)) {
        reject({ message: "Please enter a valid phone number!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.shortName) {
        reject({ message: "ShortName is required!" });
        return;
      }

      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addTaxValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.percentage) {
        reject({ message: "Percentage is required!" });
        return;
      }
      if (body.percentage && isNaN(body.percentage)) {
        reject({ message: "Please enter a valid Percentage!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addVehicleValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }

      if (!body.business) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.model) {
        reject({ message: "Model is required!" });
        return;
      }
      if (!body.facility) {
        reject({ message: "Facility is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addQuantityNormValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      for (let index = 0; index < body.length; index++) {
        const element = body[index];
        if (!element.product) {
          reject({ message: "Product is required!" });
          return;
        }

        if (!element.business) {
          reject({ message: "Business is required!" });
          return;
        }
        if (!element.minOrdQty) {
          reject({ message: "Minimun order quantity is required!" });
          return;
        }
        if (!element.maxOrdQty) {
          reject({ message: "Maximum order quantity is required!" });
          return;
        }
        if (!element.facility) {
          reject({ message: "Facility is required!" });
          return;
        }
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addRoleValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.addMenuRoleValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.menu) {
        reject({ message: "Menu is required!" });
        return;
      }
      if (!body.roleId) {
        reject({ message: "Role is required!" });
        return;
      }
      if (!body.businessId) {
        reject({ message: "Business is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.addPolicyValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.roleId) {
        reject({ message: "Role is required!" });
        return;
      }
      if (!body.businessId) {
        reject({ message: "Business is required!" });
        return;
      }
      if (!body.action || body.action.length === 0) {
        reject({ message: "Action is required!" });
        return;
      }
      if (body.action && body.action.length > 0) {
        for (let index = 0; index < body.action.length; index++) {
          const element = body.action[index];
          if (!["Create", "Update", "Delete", "View"].includes(element)) {
            reject({ message: "Please enter a valid action!" });
            return;
          }
        }
      }
      if (!body.resource || body.resource.length === 0) {
        reject({ message: "Resource is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateUserRegistrationRequest = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({
          message: "Name is required!",
        });
        return;
      }
      if (!(body.email || body.phone)) {
        console.error("Please give email or mobile Number.");
        reject({
          message: "Please give email or mobile number.",
        });
        return;
      }
      if (body.email && !body.email.match(emailRegex)) {
        reject({ message: "Please enter a valid email!" });
        return;
      }
      if (body.phone && !body.phone.match(phoneRegex)) {
        reject({ message: "Please enter a valid phone number!" });
        return;
      }
      if (
        !body.businessRoleMap.roles ||
        body.businessRoleMap.roles.length === 0
      ) {
        reject({
          message: "Role field should not be blank.",
        });
        return;
      }
      if (!body.businessRoleMap.business) {
        reject({
          message: "Business is required!",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.addCountryValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });
exports.addStateValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      if (!body.country) {
        reject({ message: "Country is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addBusinessValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      if (!body.email) {
        reject({ message: "Email is required!" });
        return;
      }
      if (body.email && !body.email.match(emailRegex)) {
        reject({ message: "Please enter a valid email!" });
        return;
      }
      if (body.phone && !body.phone.match(phoneRegex)) {
        reject({ message: "Please enter a valid phone number!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addAddressValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!(body.email || body.phone)) {
        reject({
          message: "Please give email or mobile number.",
        });
        return;
      }
      for (let index = 0; index < body.address.length; index++) {
        const element = body.address[index];
        if (!element.name) {
          reject({
            message: "Name is required!",
          });
          return;
        }
        if (!element.phone) {
          reject({
            message: "Phone number is required!",
          });
          return;
        }
        if (element.phone && !element.phone.match(phoneRegex)) {
          reject({ message: "Please enter a valid phone number!" });
          return;
        }
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.sendOtpValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.phone) {
        reject({
          message: "Please enter phone number.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.generateOrderValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.facility) {
        reject({
          message: "Please enter Facility.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.saveOrderValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.facility) {
        reject({
          message: "Please enter Facility.",
        });
        return;
      }
      if (!body.business) {
        reject({
          message: "Please enter Business.",
        });
        return;
      }
      if (!body.suppliers) {
        reject({
          message: "Please enter Supplier.",
        });
        return;
      }
      if (!body.products || body.products.length === 0) {
        reject({
          message: "Please enter Products.",
        });
        return;
      }
      if (body.products && body.products.length > 0) {
        for (let index = 0; index < body.products.length; index++) {
          const element = body.products[index];
          if (!element.product) {
            reject({
              message: "Product is required!",
            });
            return;
          }
          if (element.ordNoOfCase && isNaN(element.ordNoOfCase)) {
            reject({ message: "Please enter a valid order NoOfCase!" });
            return;
          }
          if (element.ordNoOfProduct && isNaN(element.ordNoOfProduct)) {
            reject({ message: "Please enter a valid order NoOfProduct!" });
            return;
          }
        }
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.createBillValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.business) {
        reject({
          message: "Please enter Business.",
        });
        return;
      }
      if (!body.suppliers) {
        reject({
          message: "Please enter Supplier.",
        });
        return;
      }
      if (!body.products || body.products.length === 0) {
        reject({
          message: "Please enter Products.",
        });
        return;
      }
      if (body.products && body.products.length > 0) {
        for (let index = 0; index < body.products.length; index++) {
          const element = body.products[index];
          if (!element.product) {
            reject({
              message: "Product is required!",
            });
            return;
          }
          if (element.ordNoOfCase && isNaN(element.ordNoOfCase)) {
            reject({ message: "Please enter a valid order NoOfCase!" });
            return;
          }
          if (element.ordNoOfProduct && isNaN(element.ordNoOfProduct)) {
            reject({ message: "Please enter a valid order NoOfProduct!" });
            return;
          }
        }
      }
      if (body.email && !body.email.match(emailRegex)) {
        reject({ message: "Please enter a valid email!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.rejectOrderValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.orderId) {
        reject({
          message: "Please enter orderId.",
        });
        return;
      }
      if (!body.reason) {
        reject({
          message: "Please enter Reason.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.assignVehicleValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.orderId) {
        reject({
          message: "Please enter orderId.",
        });
        return;
      }
      if (!body.vehicle) {
        reject({
          message: "Please enter vehicle.",
        });
        return;
      }
      if (!body.facility) {
        reject({
          message: "Please enter facility.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.assignVehicleValidateForReturn = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.returnId) {
        reject({
          message: "Please enter returnId.",
        });
        return;
      }
      if (!body.vehicle) {
        reject({
          message: "Please enter vehicle.",
        });
        return;
      }
      if (!body.facility) {
        reject({
          message: "Please enter facility.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.returnOrderValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.facility) {
        reject({
          message: "Please enter Facility.",
        });
        return;
      }
      if (!body.business) {
        reject({
          message: "Please enter Business.",
        });
        return;
      }
      if (!body.suppliers) {
        reject({
          message: "Please enter Supplier.",
        });
        return;
      }
      if (!body.products || body.products.length === 0) {
        reject({
          message: "Please enter Products.",
        });
        return;
      }
      if (body.products && body.products.length > 0) {
        for (let index = 0; index < body.products.length; index++) {
          const element = body.products[index];
          if (!element.productId) {
            reject({
              message: "Product is required!",
            });
            return;
          }
          if (element.noOfCase && isNaN(element.noOfCase)) {
            reject({ message: "Please enter a valid  NoOfCase!" });
            return;
          }
          if (element.noOfProduct && isNaN(element.noOfProduct)) {
            reject({ message: "Please enter a valid  NoOfProduct!" });
            return;
          }
          if (!element.lotArray || element.lotArray.length === 0) {
            reject({
              message: "Please enter LotArray.",
            });
            return;
          }
          element.totalcase = element.lotArray
            .map((t) => (t.noOfCase ? Number(t.noOfCase) : 0))
            .reduce((a, b) => {
              return a + b;
            }, 0);
          if (element.totalcase > element.noOfCase) {
            reject({
              message: "lot no of case cannot exceed the total case qty!",
            });
            return;
          }
          element.totalProduct = element.lotArray
            .map((t) => (t.noOfProduct ? Number(t.noOfProduct) : 0))
            .reduce((a, b) => {
              return a + b;
            }, 0);
          if (element.totalProduct > element.noOfProduct) {
            reject({
              message: "lot no of product cannot exceed the total product qty!",
            });
            return;
          }
        }
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.rejectReturnOrderValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.returnId) {
        reject({
          message: "Please enter returnId.",
        });
        return;
      }
      if (!body.reason) {
        reject({
          message: "Please enter Reason.",
        });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.addStockMismatchReasonValidate = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Name is required!" });
        return;
      }
      if (!body.facility) {
        reject({ message: "Facility is required!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
      return;
    }
  });

exports.addLeadValidation = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.business) {
        reject({
          message: "Please provide business!",
        });
        return;
      }
      if (!body.name) {
        reject({
          message: "Name is required!",
        });
        return;
      }
      if (body.address) {
        if (!body.address.line1) {
          reject({
            message: "Line is required!",
          });
          return;
        }
        if (!body.address.city) {
          reject({
            message: "City is required!",
          });
          return;
        }
        if (!body.address.district) {
          reject({
            message: "District is required!",
          });
          return;
        }
        if (!body.address.state) {
          reject({
            message: "State is required!",
          });
          return;
        }
        if (!body.address.pinCode) {
          reject({
            message: "PinCode is required!",
          });
          return;
        }
      }
      if (!body.email) {
        reject({ message: "Email is required!" });
        return;
      }
      if (body.email && !body.email.match(emailRegex)) {
        reject({ message: "Please enter a valid email!" });
        return;
      }
      if (body.phone && !body.phone.match(phoneRegex)) {
        reject({ message: "Please enter a valid phone number!" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.updateStockValidation = async (inventory, body) =>
  new Promise((resolve, reject) => {
    try {
      Promise.all(
        inventory.products.map((element) => {
          let request = body.products.find((x) => x._id === element._id);
          if (request) {
            let missingTotalCase = element.noOfCase - request.noOfCase;
            let missingTotalProduct = element.noOfProduct - request.noOfProduct;

            for (let index = 0; index < request.missingStocks.length; index++) {
              const e = request.missingStocks[index];
              if (!e.reason) {
                reject({
                  message: "Please provide missing reason!",
                });
                return;
              }
              if (!(e.caseQty || e.productQty)) {
                reject({
                  message: "Please provide case/unit quantity.",
                });
                return;
              }
            }

            let givenTotalCase = request.missingStocks
              .map((x) => (x.caseQty ? x.caseQty : 0))
              .reduce((a, b) => {
                return a + b;
              }, 0);

            let givenTotalProduct = request.missingStocks
              .map((x) => (x.productQty ? x.productQty : 0))
              .reduce((a, b) => {
                return a + b;
              }, 0);

            if (givenTotalCase > missingTotalCase) {
              reject({
                message: "Cannot exceed the total missmatch case!",
              });
              return;
            }
            if (givenTotalProduct > missingTotalProduct) {
              reject({
                message: "Cannot exceed the total missmatch Product!",
              });
              return;
            }
          }
        })
      )
        .then((result) => resolve(true))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateFacilityFetchByLocation = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (
        !body.coordinates &&
        !body.coordinates.latitude &&
        !body.coordinates.longitude
      ) {
        reject({ message: "Please provide location." });
      }
      if (!body.coordinates.latitude && !body.coordinates.longitude) {
        reject({ message: "Please provide proper latitude and longitude." });
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateAddressRequest = async (body) =>
  new Promise((resolve, reject) => {
    try {
      if (!body.name) {
        reject({ message: "Please provide name!" });
        return;
      }
      if (!body.phone) {
        reject({ message: "Please provide contact number!" });
        return;
      }
      if (!body.street1) {
        reject({ message: "Please provide Stree 1 address!" });
        return;
      }
      if (!body.city) {
        reject({ message: "Please provide City!" });
        return;
      }
      if (!body.pincode) {
        reject({ message: "Please provide pincode!" });
        return;
      }
      if (!body.state) {
        reject({ message: "Please provide state" });
        return;
      }
      if (!body.country) {
        reject({ message: "Please provide country" });
        return;
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

exports.validateCouponRequest = (body) =>
  new Promise((resolve, reject) => {
    try {
      if (body.action === "Apply") {
        if (!body.coupon || !body.action) {
          reject({ message: "Provide Coupon!" });
        }
        if (!body._id) {
          reject({ message: "Invalid Cart" });
        }
      }

      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

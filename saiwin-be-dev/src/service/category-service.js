var Category = require("../models/category");
var Business = require("../models/business");
const { categoryEvent, keywordEvent } = require("../utils/event-util");
const {
  bodyToCategoryFilterObject,
  bodyToCategoryObject,
  bodyToMultipleCategory,
} = require("../utils/conversion-util");
const { fetchBusinessById } = require("./business-service");
const { addCategoryValidate } = require("../utils/validate-request");
const { resizeImage } = require("./image-service");

exports.create = async (req, res) => {
  try {
    let body = req.body,
      image,
      icon;
    addCategoryValidate(body)
      .then((result) => fetchBusinessById(body.business))
      .then(() => resizeImage(body.image))
      .then((result) => {
        image = result;
        return resizeImage(body.icon);
      })
      .then((result) => {
        icon = result;
        return bodyToCategoryObject(body);
      })
      .then((result) =>
        body._id
          ? update({ $set: { ...result, image: image, icon: icon } }, body._id)
          : create({ ...result, image: image, icon: icon })
      )
      .then((result) => populateAfterSave(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 11000) {
          return res.status(500).json({
            message: "Already exists",
          });
        }
        return res.status(500).json(error);
      });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const update = async (query, categoryId) =>
  new Promise((resolve, reject) => {
    try {
      Category.findByIdAndUpdate(categoryId, query, (err, resp) => {
        if (err) {
          reject(err);
        }
        if (resp) {
          let updatedName = query["$set"].name;
          resolve({
            ...JSON.parse(JSON.stringify(resp)),
            name: updatedName,
            description: query["$set"].description,
            active: query["$set"].active,
            notifyBeforeExpiry: query["$set"].notifyBeforeExpiry,
          });
          categoryEvent.emit("update", {
            ...JSON.parse(JSON.stringify(resp)),
            updatedName: updatedName,
          });
          let obj = {
            business: resp.business,
            type: "Category",
            itemId: resp._id,
            itemName: updatedName,
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

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      this.fetchParentCategory(obj.parentCategory).then((result) => {
        let searchCategory = [obj.name];
        if (result) {
          searchCategory.unshift(...result.searchCategory);
        }
        obj.searchCategory = searchCategory;
        let category = Category(obj);
        category.save((err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            let obj = {
              business: resp.business,
              type: "Category",
              itemId: resp._id,
              itemName: resp.name,
            };
            keywordEvent.emit("create", obj);
          } else {
            reject({ message: "Unable to create!" });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });

const populateAfterSave = async (doc) =>
  new Promise((resolve, reject) => {
    try {
      Category.populate(doc, { path: "parentCategory" }, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        resolve(response);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
exports.findCategories = async (req, res) => {
  try {
    bodyToCategoryFilterObject(req.body)
      .then((result) => this.findCategory(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.changeCategoryStatus = async (req, res) => {
  try {
    Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        $set: {
          active: req.params.status,
        },
      },
      {
        new: true,
      },
      (_err, _res) => {
        if (_err) {
          console.error(_err);
          return res.status(500).json(_err);
        }

        if (_res) {
          return res.status(200).json(_res);
        } else {
          return res.status(500).json({
            message: "Unable to process!!!",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchParentCategory = async (categoryId) =>
  new Promise((resolve, reject) => {
    try {
      Category.findOne({ _id: categoryId }, (err_cat, res_cat) => {
        if (err_cat) {
          reject(err_cat);
        }
        resolve(res_cat);
      });
    } catch (e) {
      reject(e);
    }
  });

categoryEvent.on("update", (data) => {
  Category.updateMany(
    { searchCategory: data.name, business: data.business },
    {
      $set: {
        "searchCategory.$": data.updatedName,
      },
    }
  ).exec();
});

exports.categoryExists = async (categoryId) =>
  new Promise((resolve, reject) => {
    try {
      Category.exists(
        {
          _id: categoryId,
        },
        (err, res) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (res) {
            resolve(res);
          } else {
            reject({ message: "Provide a valid Category" });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });

exports.findCategory = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      Category.find(queryObj.query, queryObj.project, queryObj.size)
        .populate(queryObj.populate)
        .then(
          (result) => resolve(result),
          (error) => {
            console.error(error);
            reject(error);
          }
        );
    } catch (e) {
      reject(e);
    }
  });

exports.createMultipleCategory = async (obj, business) =>
  new Promise((resolve, reject) => {
    try {
      bodyToMultipleCategory(obj, business).then((result) => {
        Category.insertMany(result, (err, resp) => {
          if (err) {
            reject(err);
          }
          if (resp) {
            resolve(resp);
            categoryEvent.emit("new-created", {
              business: business,
            });
          } else {
            reject({ message: "Unable to create!" });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  });

exports.fetchImage = async (req, res) => {
  try {
    let project = req.query.type === "image" ? { image: 1 } : { icon: 1 };
    Category.findById(req.query.id, project, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      if (response) {
        var image = Buffer.from(
          (response.image || response.icon).image,
          "base64"
        );
        res.writeHead(200, {
          "Content-type": (response.image || response.icon).mimType,
          "Content-Length": image.length,
        });
        res.end(image);
      } else {
        res.end();
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

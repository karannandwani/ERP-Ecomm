var LandingPageData = require("../models/landing-page-data");
const { bodyToLandingPageObject } = require("../utils/conversion-util");
const { findCategory } = require("./category-service");
const { findByQuery } = require("./manufacturer-service");
const { fetchProductsByQuery } = require("./product-service");
const mongoose = require("mongoose");

exports.fetchData = async (req, res) => {
  try {
    fetchDataByQuery(req.body)
      .then((result) =>
        fetchDataAccordingToQuery(JSON.parse(JSON.stringify(result)))
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchDataByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      LandingPageData.find(query, null, {
        sort: { order: 1 },
      })
        .populate([{ path: "slideImages" }])
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

exports.fetchDataForEcom = async (req, res) => {
  try {
    fetchDataAccordingToQueryForEcom(req.body)
      .then((result) =>
        fetchDataAccordingToQuery(JSON.parse(JSON.stringify(result)), "ecom")
      )
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchDataAccordingToQueryForEcom = async (query) =>
  new Promise((resolve, reject) => {
    try {
      LandingPageData.aggregate(
        [
          {
            $match: {
              ...query,
              business: mongoose.Types.ObjectId(query.business),
            },
          },
          {
            $lookup: {
              from: "slideimages",
              localField: "slideImages",
              foreignField: "_id",
              as: "slideImages",
            },
          },
          {
            $unwind: {
              path: "$slideImages",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              slideImage: {
                _id: "$slideImages._id",
                name: "$slideImages.name",
                image: {
                  $cond: [
                    {
                      $eq: ["$slideImages.type", "URL"],
                    },
                    "$slideImages.image",
                    null,
                  ],
                },
                redirectData: "$slideImages.redirectData",
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              type: {
                $first: "$type",
              },
              slideImages: {
                $push: "$slideImage",
              },
              order: {
                $first: "$order",
              },
              dataQuery: {
                $first: "$dataQuery",
              },
              viewType: {
                $first: "$viewType",
              },
            },
          },
          {
            $sort: {
              order: 1,
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

const fetchDataAccordingToQuery = async (response, type) =>
  new Promise((resolve, reject) => {
    Promise.all(
      response.map((x) => {
        if (x.dataQuery) {
          return fetchMasterData(x.dataQuery, type)
            .then((res) => {
              return { ...x, data: res };
            })
            .catch((err) => {
              console.error(err);
              throw err;
            });
        } else {
          return x;
        }
      })
    )
      .then((result) => resolve(result.sort((a, b) => a.order - b.order)))
      .catch((error) => reject(error));
  });

const fetchMasterData = async (dataQuery, type) =>
  new Promise((resolve, reject) => {
    try {
      (dataQuery.type === "Category"
        ? findCategory({
            query: dataQuery.query,
            size: { limit: dataQuery.limit },
            project: type ? { "image.image": 0, "icon.image": 0 } : null,
          })
        : dataQuery.type === "Manufacturer"
        ? findByQuery({
            query: dataQuery.query,
            size: { limit: dataQuery.limit },
            project: type ? { "image.image": 0 } : null,
          })
        : dataQuery.type === "Product"
        ? fetchProductsByQuery({
            query: dataQuery.query,
            size: { limit: dataQuery.limit },
            project: type ? { image: 0 } : null,
          })
        : []
      ).then(
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

exports.create = async (req, res) => {
  try {
    bodyToLandingPageObject(req.body)
      .then((result) =>
        req.body._id ? update(req.body._id, result) : createData(result)
      )
      .then((result) => fetchDataAccordingToQuery([result]))
      .then((result) => {
        let response = JSON.parse(JSON.stringify(result));
        let [firstElement] = response;
        return res.status(200).json(firstElement._doc || firstElement);
      })
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const createData = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let data = LandingPageData(obj);
      data.save((error, response) => {
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
const update = async (id, obj) =>
  new Promise((resolve, reject) => {
    try {
      LandingPageData.findByIdAndUpdate(
        id,
        { $set: obj },
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

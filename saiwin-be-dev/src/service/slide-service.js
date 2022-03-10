var Slide = require("../models/slide-images");
const { bodyToSlideObject } = require("../utils/conversion-util");

exports.create = async (req, res) => {
  try {
    bodyToSlideObject(req.body)
      .then((result) =>
        req.body._id ? update(req.body._id, result) : create(result)
      )
      .then((result) => fetchSlide({ _id: result._id }))
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const create = async (obj) =>
  new Promise((resolve, reject) => {
    try {
      let slide = new Slide(obj);
      slide.save((error, response) => {
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
      Slide.findByIdAndUpdate(id, { $set: obj }, (error, response) => {
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
exports.fetch = async (req, res) => {
  try {
    fetchSlide({ business: req.body.business })
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const fetchSlide = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Slide.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "categories",
            localField: "redirectData.id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "manufacturers",
            localField: "redirectData.id",
            foreignField: "_id",
            as: "manufacturer",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "redirectData.id",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: {
            path: "$brand",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$manufacturer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]).then(
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

exports.fetchImage = async (req, res) => {
  try {
    Slide.findById(req.query.id, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      var matches = response.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches.length !== 3) {
        return new Error("Invalid input string");
      }

      var image = Buffer.from(matches[2], "base64");
      res.writeHead(200, {
        "Content-type": matches[1],
        "Content-Length": image.length,
      });
      res.end(image);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

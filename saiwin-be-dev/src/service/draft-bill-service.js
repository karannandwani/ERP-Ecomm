const DraftBill = require("../models/draft-bill");
const mongoose = require("mongoose");
const Product = require("../models/product");
exports.createBill = async (req, res) => {
  try {
    let body = req.body;
    let newDraft = new DraftBill(body);
    newDraft.save({ validateBeforeSave: true }, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }

      if (response) {
        DraftBill.populate(
          response,
          [{ path: "products.product" }],
          (err, resp) => {
            if (err) {
              console.error(err);
              return res.status(500).json(err);
            }
            if (resp) {
              return res.status(200).json(resp);
            }
          }
        );
      } else {
        return res.status(500).json({ message: "Error Occured" });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchDraftBill = async (req, res) => {
  try {
    DraftBill.find({
      suppliers: mongoose.Types.ObjectId(req.params.facility),
    })
      .populate("products.product")
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (error) => {
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.fetchDraftById = async (req, res) => {
  try {
    DraftBill.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "inventories",
          let: {
            sId: "$suppliers",
            pId: "$products.product",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$$sId", "$facility"],
                    },
                    {
                      $eq: ["$$pId", "$product"],
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
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $unwind: {
          path: "$inventory",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          products: {
            $push: {
              _id: "$products._id",
              lotArray: "$products.lotArray",
              product: "$product",
              ordNoOfCase: "$products.ordNoOfCase",
              ordNoOfProduct: "$products.ordNoOfProduct",
              inventory: "$inventory",
            },
          },
          suppliers: {
            $first: "$suppliers",
          },
          business: {
            $first: "$business",
          },
          email: {
            $first: "$email",
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
    ]).then(
      (result) => {
        return res.status(200).json(result[0]);
      },
      (error) => {
        return res.status(500).json(error);
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

exports.deleteDraftBill = async (req, res) => {
  try {
    DraftBill.findByIdAndDelete(req.params.draftId, (error, _res) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      return res.status(200).json({
        message: "Deleted",
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchDraftBillByFacilities = async (req, res) => {
  try {
    DraftBill.find({
      suppliers: {
        $in: req.body.facilities.map((x) => mongoose.Types.ObjectId(x)),
      },
    })
      .populate([{ path: "products.product" }])
      .then(
        (result) => {
          return res.status(200).json(result);
        },
        (error) => {
          return res.status(500).json(error);
        }
      );
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

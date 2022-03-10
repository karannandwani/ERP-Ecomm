const DraftOrder = require("../models/order-draft");
const mongoose = require("mongoose");

exports.saveDraftOrder = async (req, res) => {
  try {
    let body = req.body;
    let newDraft = new DraftOrder(body);
    newDraft.save(
      {
        validateBeforeSave: true,
      },
      (error, response) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }

        if (response) {
          DraftOrder.populate(
            response,
            [{ path: "products.product" }],
            (error_pop, response_pop) => {
              if (error_pop) {
                console.error(error_pop);
                return res.status(500).json(error_pop);
              }
              if (response_pop) {
                return res.status(200).json(response_pop);
              }
            }
          );
        } else {
          return res.status(500).json({
            message: "Error Occured",
          });
        }
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchDraftOrder = async (req, res) => {
  try {
    DraftOrder.find({
      facility: mongoose.Types.ObjectId(req.params.facility),
      suppliers: mongoose.Types.ObjectId(req.params.suppliers),
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
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.deleteDraftOrder = async (req, res) => {
  try {
    DraftOrder.findByIdAndDelete(req.params.draftId, (error, response) => {
      if (error) {
        console.error(error);
        return res.status(500).json(error);
      }
      return res.status(200).json(response);
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

exports.fetchDrafts = async (req, res) => {
  try {
    DraftOrder.find({ facility: { $in: req.body.facilities } })
      .populate([{ path: "products.product" }])
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

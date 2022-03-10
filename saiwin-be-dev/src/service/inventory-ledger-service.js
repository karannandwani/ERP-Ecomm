const { inventoryLedgerEvent } = require("../utils/event-util");
var InventoryLedger = require("../models/inventory-ledger");
var mongoose = require("mongoose");
const { bodyToInventoryLedgerObject } = require("../utils/conversion-util");

exports.inventoryLedgerInit = () => {
  console.log("Inventory Ledger Service init");
};

inventoryLedgerEvent.on("create", (data) => {
  let inventory = data.inventory;
  InventoryLedger.findOneAndUpdate(
    {
      product: inventory.product,
      facility: inventory.facility,
      business: inventory.business,
    },
    {
      $push: {
        products: data.products,
      },
    },
    { upsert: true }
  ).exec();
});

exports.inventoryLedgerDetails = async (req, res) => {
  try {
    InventoryLedger.findOne({
      $and: [
        {
          facility: mongoose.Types.ObjectId(req.body.facility),
        },
        {
          product: mongoose.Types.ObjectId(req.body.product),
        },
        {
          business: req.body.business,
        },
      ],
    })
      .populate([
        { path: "product" },
        { path: "facility" },
        { path: "products.supplier" },
        { path: "products.customer", select: { password: 0 } },
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

exports.fetchInventoryLedger = async (req, res) => {
  try {
    bodyToInventoryLedgerObject(req.query)
      .then((result) => findLedger(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findLedger = async (queryObj) =>
  new Promise((resolve, reject) => {
    try {
      InventoryLedger.find(queryObj.query, null, queryObj.size)
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

exports.inventoryLedgerDetailsUpdated = async (req, res) => {
  try {
    let findObj =
      req.body.type === "Business"
        ? {
            business: req.body.business,
          }
        : {
            $and: [
              {
                facility: {
                  $in: req.body.facilities.map((x) =>
                    mongoose.Types.ObjectId(x)
                  ),
                },
              },
            ],
          };
    InventoryLedger.find(findObj)
      .populate([
        { path: "products.supplier" },
        { path: "products.customer", select: { password: 0 } },
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

const { keywordEvent } = require("../utils/event-util");
var Keywords = require("../models/keywords");

const { bodyToKeywordFilterObject } = require("../utils/conversion-util");
exports.keywordInit = () => {
  console.log("Keyword Service init");
};
keywordEvent.on("create", (data) => {
  Keywords.findOneAndUpdate(
    {
      itemId: data.itemId,
    },
    {
      $set: data,
    },
    { upsert: true }
  ).exec();
});

exports.fetchkeywords = async (req, res) => {
  try {
    bodyToKeywordFilterObject(req.query)
      .then((result) => findByQuery(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).json(error));
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const findByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      Keywords.find(query.query, null, query.size, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    } catch (e) {
      reject(e);
    }
  });

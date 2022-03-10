var GeneratedOrder = require("../models/generated-order");

exports.fetchGeneratedOrderByQuery = async (query) =>
  new Promise((resolve, reject) => {
    try {
      GeneratedOrder.findOne(query, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }

        if (response) {
          resolve(response);
        } else {
          console.error("No GeneratedOrder found!");
          reject({ message: "No GeneratedOrder found!" });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

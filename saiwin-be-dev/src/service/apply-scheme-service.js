var Order = require("../models/order");
const { findSchemesByQuery } = require("./scheme-service");
const lodash = require("lodash");

exports.checkForSchemeAndApply = async (orderId) =>
  new Promise((resolve, reject) => {
    findSchemesByQuery({ active: true })
      .then((schemes) => {
        if (schemes && schemes.length > 0) {
          return checkSchemesOnOrder(orderId, schemes);
        } else {
          return true;
        }
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

const checkSchemesOnOrder = (orderId, schemes) =>
  new Promise((resolve, reject) => {
    Promise.all(
      schemes.map((scheme) => {
        return Promise.all(
          scheme.conditions.map((condition) => {
            // let query = lodash.template(condition.variable.query, {});
            // const result = JSON.parse(query({ orderId: orderId }));
            return eval(condition.variable.query).then(
              (response) => {
                return response;
              },
              (error) => {
                console.error(error);
                throw error;
              }
            );
          })
        ).then((conditions) => {
          return {
            applied: conditions.reduce((sum, next) => sum && next, true),
            scheme: scheme,
          };
        });
      })
    )
      .then((result) =>
        evaluateEffect(
          orderId,
          result.filter((x) => x.applied).map((x) => x.scheme)
        )
      )
      .then((evaluatedSchemes) => {
        let schemeList = evaluatedSchemes.map((x) => ({
          scheme: x,
          applied: x.autoApplied,
        }));
        return Order.findByIdAndUpdate(orderId, {
          $set: { schemes: schemeList },
        }).exec();
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

const evaluateEffect = async (orderId, schemes) =>
  new Promise((resolve, reject) => {
    Promise.all(
      schemes.map((scheme) => {
        return Promise.all(
          scheme.effects.map((effect) => {
            if (effect.name.startsWith("Discount"))
              return applySchemeForDiscount(orderId, effect);
            else if (effect.name === "Free Product") return;
          })
        ).then((effects) => {
          let schemeObj = JSON.parse(JSON.stringify(scheme));
          delete schemeObj["_id"];
          return {
            ...schemeObj,
            effects: effects,
          };
        });
      })
    )
      .then((evaluatedSchemes) => resolve(evaluatedSchemes))
      .catch((error) => reject(error));
  });

const applySchemeForDiscount = async (orderId, effect) =>
  new Promise((resolve, reject) => {
    try {
      Order.findById(orderId, { subTotal: 1 }, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          let discount;
          if (effect.name.includes("%")) {
            let discountAmount =
              (response.subTotal * effect.parameter.discountPercent) / 100;
            discount =
              discountAmount > effect.parameter.maxDiscount
                ? effect.parameter.maxDiscount
                : discountAmount;
          } else {
            discount = effect.parameter.discount;
          }
          resolve({
            ...JSON.parse(JSON.stringify(effect)),
            discountAmount: discount,
          });
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

const applySchemeForExtraProduct = async (orderId, effect) =>
  new Promise((resolve, reject) => {
    try {
      eval(effect.parameter.freeEvaluation).then((response) => {
        resolve({
          ...JSON.parse(JSON.stringify(effect)),
          freeCount: response,
        });
      });
      // .catch((error) => )

      Order.findById(orderId, { products: 1 }, (error, response) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        if (response) {
          let app = response.products.find(
            (x) => x.product.toString() === effect.parameter.product
          );
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

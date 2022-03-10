export const addPriceListGroup = (pricelistObj) => (dispatch) => {
  return dispatch({
    type: "ADD_PRICELIST_GROUP",
    payload: {
      request: {
        url: `api/pricelist-group`,
        method: "POST",
        data: pricelistObj,
      },
    },
  });
};
export const fetchPricelistGroupNames = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_PRICELIST_NAME",
    payload: {
      request: {
        url: `api/pricelist-group/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

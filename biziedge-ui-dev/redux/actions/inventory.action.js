export const setBrandCount = (count) => (dispatch) => {
  return dispatch({
    type: "SET_BRAND_COUNT",
    payload: {
      data: count,
    },
  });
};
export const setProductCount = (count) => (dispatch) => {
  return dispatch({
    type: "SET_PRODUCT_COUNT",
    payload: {
      data: count,
    },
  });
};

export const fetchInventory = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_INVENTORY",
    payload: {
      request: {
        url: `api/inventory`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const generateOrder = (data) => (dispatch) => {
  return dispatch({
    type: "GENERATE_ORDER",
    payload: {
      request: {
        url: "/api/order/generate",
        method: "POST",
        data: data,
      },
    },
  });
};

export const saveOrder = (data, navigate) => (dispatch) => {
  return dispatch({
    type: "SAVE_ORDER",
    navigate: navigate,
    payload: {
      requestOffline: {
        url: "/api/order/save",
        method: "POST",
        data: data,
      },
    },
    meta: {
      offline: {},
    },
  });
};

export const fetchInventoryLedger = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_INVENTORY_LEDGER",
    payload: {
      request: {
        url: "api/inventoryLedger",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchReasons = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_REASONS",
    payload: {
      request: {
        url: `api/stock-mismatch-reason?facility=${obj.facility}`,
        method: "get",
      },
    },
  });
};

export const stockUpdate = (obj) => (dispatch) => {
  return dispatch({
    type: "STOCK_UPDATE",
    payload: {
      request: {
        url: "api/inventory/stock-update",
        method: "POST",
        data: obj,
      },
    },
  });
};

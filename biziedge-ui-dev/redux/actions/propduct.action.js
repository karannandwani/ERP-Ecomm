export const addProduct = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_PRODUCT",
    payload: {
      request: {
        url: "/api/product",
        method: "POST",
        data: data,
      },
    },
  });
};
export const fetchProducts = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_PRODUCT",
    payload: {
      request: {
        url: `api/product/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchProductsWithStock = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_PRODUCTS_WITH_STOCK",
    payload: {
      request: {
        url: `api/product/with-stock`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchPrices = (obj) => (dispatch) => {
  return dispatch({
    type: "PRODUCT_PRICE",
    payload: {
      request: {
        url: `api/order/fetchPrice`,
        method: "POST",
        data: obj,
      },
    },
  });
};


export const uploadMultipleProduct = (obj) => (dispatch) => {
  return dispatch({
    type: "MULTIPLE_PRODUCT",
    payload: {
      request: {
        url: `api/product/create-multiple`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const downloadTemplate = () => (dispatch) => {
  return dispatch({
    type: "DOWNLOAD_TEMPLATE",
    payload: {
      request: {
        url: `api/product/download/template`,
        method: "GET",
        responseType: "blob",
      },
    },
  });
};

export const updateReturnableStatus = (obj) => (dispatch) => {
  return dispatch({
    type: "RETURNABLE_STATUS_UPDATE",
    payload: {
      request: {
        url: `api/product/update/returnable`,
        method: "POST",
        data: obj,
      },
    },
  });
};

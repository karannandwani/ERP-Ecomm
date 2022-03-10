export const fetchProducts = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_PRODUCT",
    payload: {
      request: {
        url: `api/inventory/products/ecom`,
        method: "POST",
        data: obj,
      },
    },
  });
};

// export const fetchPrices = (obj) => (dispatch) => {
//   return dispatch({
//     type: "PRODUCT_PRICE",
//     payload: {
//       request: {
//         url: `api/order/fetchPrice`,
//         method: "POST",
//         data: obj,
//       },
//     },
//   });
// };

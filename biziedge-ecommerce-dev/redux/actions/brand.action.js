export const fetchBrands = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BRAND_NAMES",
    payload: {
      request: {
        url: `api/brand?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};

export const fetchCategories = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_CATEGORIES",
    payload: {
      request: {
        url: `api/category/fetchCategory`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const addProductCategory = (categoryObj) => (dispatch) => {
  return dispatch({
    type: "ADD_CATEGORY",
    payload: {
      request: {
        url: `api/category`,
        method: "POST",
        data: categoryObj,
      },
    },
  });
};
export const fetchProductCategories = (obj) => (dispatch) => {
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

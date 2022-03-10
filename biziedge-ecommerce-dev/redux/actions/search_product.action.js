export const fetchSearchProductList = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_SEARCHLIST",
    payload: {
      request: {
        url: `api/keywords?business=${data.business}${`&name=${
          data.key ? data.key : ""
        }`}`,
        method: "GET",
      },
    },
  });
};

export const clearProductSearchList = () => ({
  type: "CLEAR_PRODUCTSEARCHLIST",
  payload: [],
});

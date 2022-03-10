export const selectFilterData = (obj) => ({
  type: "ADD_FILTERDATA",
  payload: {
    data: obj,
  },
});
export const setFilteredData = (filteredObj) => ({
  type: "SET_FILTERED_DATA",
  payload: { data: filteredObj },
});

export const setSelectedBusiness = (businessObj) => ({
  type: "SET_SELECTED_BUSINESS",
  payload: {
    data: businessObj,
  },
});

export const setSelectedFacility = (facilityObj) => ({
  type: "SELECTED_FACILITY",
  payload: {
    data: facilityObj._id ? facilityObj : null,
  },
});

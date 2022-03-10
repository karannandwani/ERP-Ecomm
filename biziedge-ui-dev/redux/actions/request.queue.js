export const setSelectedBusiness = (request) => ({
  type: "ADD_TO_QUEUE",
  payload: {
    data: request,
  },
});

export const setSelectedBusiness = () => ({
  type: "REMOVE_REQUESTS",
});

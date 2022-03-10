export const loading = (uid) => ({
  type: "LOADING",
  payload: uid,
});

export const doneLoading = (uid) => ({
  type: "DONE_LOADING",
  payload: uid,
});

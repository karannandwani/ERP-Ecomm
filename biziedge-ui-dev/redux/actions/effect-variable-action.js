export const fetchEffectVariable = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_EFFECT_VARIABLE",
    payload: {
      request: {
        url: `api/effect-variable?business=${data.business}`,
        method: "GET",
      },
    },
  });
};

export const addEffectVariable = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_EFFECT_VARIABLE",
    payload: {
      request: {
        url: "/api/effect-variable",
        method: "POST",
        data: data,
      },
    },
  });
};

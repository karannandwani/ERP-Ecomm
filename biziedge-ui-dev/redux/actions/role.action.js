export const fetchRoles = (obj) => (dispatch) => {
    return dispatch({
        type: "FETCH_ROLE",
        payload: {
            request: {
                url: `/api/role?pageNo=0&pageSize=2000`,
                method: "get",
            },
        },
    });
};
export const addRoleAction = (data) => (dispatch) => {
    return dispatch({
      type: "ADD_ROLE",
      payload: {
        request: {
          url: "/api/role/add",
          method: "POST",
          data: data,
        },
      },
    });
  };
export const fetchPolicies = (business) => (dispatch) => {
    return dispatch({
        type: "FETCH_POLICIES",
        payload: {
            request: {
                url: `/api/access-policy?business=${business}`,
                method: "get",
            },
        },
    });
};

export const fetchAction = () => (dispatch) => {
    return dispatch({
        type: "FETCH_ACTION",
        payload: {
            request: {
                url: `/api/action`,
                method: "get",
            },
        },
    });
};

export const fetchResources = () => (dispatch) => {
    return dispatch({
        type: "FETCH_RESOURCES",
        payload: {
            request: {
                url: `/api/resource`,
                method: "get",
            },
        },
    });
};

export const createPolicy = (policy) => (dispatch) => {
    return dispatch({
        type: "ADD_POLICIES",
        payload: {
            request: {
                url: `/api/access-policy`,
                method: "POST",
                data: policy,
            },
        },
    });
};

export const removePolicy = (id) => (dispatch) => {
    return dispatch({
        type: "REMOVE_POLICIES",
        payload: {
            request: {
                url: `/api/access-policy/delete/${id}`,
                method: "delete",
            },
        },
    });
};

export const fetchMenuItem = () => (dispatch) => {
    return dispatch({
        type: "FETCH_MENU_ITEM",
        payload: {
            request: {
                url: `/api/menu-item`,
                method: "get",
            },
        },
    });
};


export const fetchRoleMenu = (businessId) => (dispatch) => {
    return dispatch({
        type: "FETCH_ROLE_MENU",
        payload: {
            request: {
                url: `/api/menu-role-map/?businessId=${businessId}`,
                method: "get",
            },
        },
    });
};

export const addRoleMenu = (data) => (dispatch) => {
    return dispatch({
        type: "ADD_ROLE_MENU",
        payload: {
            request: {
                url: `/api/menu-role-map`,
                method: "POST",
                data: data,
            },
        },
    });
};

export const deleteRoleMenu = (id) => (dispatch) => {
    return dispatch({
        type: "REMOVE_ROLE_MENU",
        payload: {
            request: {
                url: `/api/menu-role-map/delete/${id}`,
                method: "delete",
            },
        },
    });
};
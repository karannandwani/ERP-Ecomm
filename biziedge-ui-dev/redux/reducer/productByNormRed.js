const initialState = [];

const productByNorm = (state = initialState, action) => {
    switch (action.type) {
        case "GENERATE_ORDER_SUCCESS": {
            return action.payload.data.products;
        }
        case "GENERATE_ORDER_FAIL": {
            return state;
        }

        case "LOGOUT": {
            return [];
        }

        default: {
            return state;
        }
    }
};

export default productByNorm;

import { addError } from "../actions/toast.action";
const initialState = [];

const inventory = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_INVENTORY_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_INVENTORY_FAIL":
    case "STOCK_UPDATE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "STOCK_UPDATE_SUCCESS": {
      let updatedRecord = action.payload.data;
      let inventoryProductIndex = state.findIndex(
        (x) => x._id === updatedRecord._id
      );
      return [
        ...state.map((x, i) =>
          i === inventoryProductIndex
            ? {
                ...x,
                products: [
                  ...x.products.map((xx) => ({
                    ...xx,
                    noOfCase: updatedRecord.products.find(
                      (y) => xx._id === y._id
                    ).noOfCase,
                    noOfProduct: updatedRecord.products.find(
                      (y) => xx._id === y._id
                    ).noOfProduct,
                  })),
                ],
              }
            : { ...x }
        ),
      ];
    }

    case "CREATE_BILL": {
      if (action.meta?.offline.retryCount) {
        return state;
      } else {
        let billData = action.payload.requestOffline.data;
        let products = billData.products.map((t) => t.product);
        try {
          return [
            ...state.map((x) => {
              if (
                x.facility === billData.suppliers &&
                products.includes(x.product._id)
              ) {
                let xx = billData.products.find(
                  (a) => a.product === x.product._id
                );
                let remainingLotQty = x.products.map((y) => {
                  let currentLot = xx.lotArray.find((z) => z.lotId === y._id);
                  if (currentLot) {
                    if (
                      (currentLot.noOfCase || 0) * currentLot.qtyPerCase +
                        (currentLot.noOfProduct || 0) >
                      (y.noOfCase || 0) * currentLot.qtyPerCase +
                        (y.noOfProduct || 0)
                    ) {
                      throw Error("Not available");
                    } else {
                      return {
                        ...y,
                        noOfCase: y.noOfCase - (currentLot.noOfCase || 0),
                        noOfProduct:
                          y.noOfProduct - (currentLot.noOfProduct || 0),
                      };
                    }
                  } else {
                    return { ...y };
                  }
                });
                return { ...x, products: remainingLotQty };
              } else {
                return { ...x };
              }
            }),
          ];
        } catch (e) {
          addError(e, 3000);
          return state;
        }
      }
    }

    case "ACCEPT_ORDER": {
      if (action.meta?.offline.retryCount) {
        return state;
      } else {
        let orderDetails = action.payload.requestOffline.data;
        let products = orderDetails.products.map((x) => x.productId);
        try {
          return [
            ...state.map((x) => {
              if (
                x.facility === orderDetails.selectedFacility &&
                products.includes(x.product._id)
              ) {
                let orderProduct = orderDetails.products.find(
                  (z) => z.productId === x.product._id
                );
                let remainingLotQty = x.products.map((y) => {
                  let currentLot = orderProduct.lots.find(
                    (z) => z.lotId === y._id
                  );
                  if (currentLot) {
                    if (
                      (currentLot.noOfCase || 0) * currentLot.qtyPerCase +
                        (currentLot.noOfProduct || 0) >
                      (y.noOfCase || 0) * currentLot.qtyPerCase +
                        (y.noOfProduct || 0)
                    ) {
                      throw Error("Not available");
                    } else {
                      return {
                        ...y,
                        noOfCase: y.noOfCase - (currentLot.noOfCase || 0),
                        noOfProduct:
                          y.noOfProduct - (currentLot.noOfProduct || 0),
                      };
                    }
                  } else {
                    return { ...y };
                  }
                });
                return { ...x, products: remainingLotQty };
              } else {
                return { ...x };
              }
            }),
          ];
        } catch (e) {
          addError(e, 3000);
          return state;
        }
      }
    }

    case "LOGOUT": {
      return [];
    }
    default: {
      return state;
    }
  }
};

export default inventory;

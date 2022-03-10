import NetInfo from "@react-native-community/netinfo";
import { store } from "../store";
var connected = false;
export var isConnected = connected;
NetInfo.fetch().then((state) => {
  connected = state.isConnected;
});

const unsubscribe = NetInfo.addEventListener((state) => {
  connected = state.isConnected;
  if (state.isConnected && store.getState().requestQueue.length > 0) {
    let temp = [...store.getState().requestQueue];
    store.dispatch({
      type: "REMOVE_REQUESTS",
    });
    temp.forEach((x) => {
      store.dispatch(x);
    });
  }
});

const offlineMiddleWare = (store) => (next) => (action) => {
  if (
    action.type &&
    action.payload?.requestOffline &&
    action.meta?.offline &&
    !connected
  ) {
    store.dispatch({
      type: "ADD_TO_QUEUE",
      payload: {
        data: {
          ...action,
          meta: {
            ...action.meta,
            offline: {
              ...action.meta.offline,
              retryCount: 1,
            },
          },
        },
      },
    });
    // requestQueue.push({
    //   ...action,
    //   meta: {
    //     ...action.meta,
    //     offline: {
    //       ...action.meta.offline,
    //       retryCount: 1,
    //     },
    //   },
    // });
    return next(action);
  } else {
    if (action.payload?.requestOffline) {
      return next({
        ...action,
        payload: { ...action.payload, request: action.payload?.requestOffline },
      });
    } else {
      return next(action);
    }
  }
};

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export default offlineMiddleWare;

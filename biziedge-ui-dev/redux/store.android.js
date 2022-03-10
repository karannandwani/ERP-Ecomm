import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer/index";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import config from "../config/config";
import asyncDispatchMiddleware from "./middleware/async-dispatch.mw";
import { uuidv4 } from "./actions/toast.action";
import { doneLoading, loading } from "./actions/loading.action";
import navigateOnSuccessMiddleware from "./middleware/navigate-on-success.mw";
import { Platform } from "react-native";
import localForage from "localforage";
import offlineMiddleWare, { isConnected } from "./middleware/offline-mw";
import FilesystemStorage from "redux-persist-filesystem-storage";
import RNFetchBlob from "rn-fetch-blob";
// import FSStorage, { CacheDir } from "redux-persist-fs-storage";
import FSStorage from "./fsstorage";
// const persistConfig = {
//   key: "root",
//   keyPrefix: "", // the redux-persist default is `persist:` which doesn't work with some file systems
//   storage: FSStorage(CacheDir, "myApp"),
// };

FilesystemStorage.config({
  storagePath: `${RNFetchBlob.fs.dirs.DocumentDir}/persistStore`,
});

// const persistConfig = {
//   key: "root",
//   storage: FilesystemStorage,
// };

const persistConfig = {
  key: "root",
  storage: FilesystemStorage,
};
const client = axios.create({
  baseURL: config.baseUrl,
  responseType: "json",
});

axios.interceptors.request.use((req) => {
  req.baseURL = store.getState().baseURL || config.baseUrl;
  req.timeout = 60000;
  if (store.getState().user && store.getState().token) {
    const token = store.getState().token;
    req.headers.common.Authorization = `Bearer ${token}`;
  }
  // Important: request interceptors **must** return the request.
  return req;
});

const effect = (eff, _action) => axios({ ...eff, ["baseURL"]: config.baseUrl });
const discard = (error, _action, _retries) => {
  const { request, response } = error;
  if (!request) throw error; // There was an error creating the request
  if (!response) return false; // There was no response
  return 400 <= response.status && response.status < 500;
};

const axiosMiddlewareConfig = {
  interceptors: {
    request: [
      function ({ getState, dispatch, getSourceAction }, req) {
        req.baseURL = getState().baseURL || config.baseUrl;
        req.timeout = 60000;
        req.uid = uuidv4();
        if (getState().user && getState().token) {
          const token = getState().token;
          req.headers.common.Authorization = `Bearer ${token}`;
        }
        dispatch(loading(req.uid));
        return req;
      },
    ],
    response: [
      {
        success: function ({ getState, dispatch, getSourceAction }, res) {
          dispatch(doneLoading(res.config.uid));
          return Promise.resolve(res);
        },
        error: function ({ getState, dispatch, getSourceAction }, error) {
          dispatch(doneLoading(error.config.uid));
          if (error && error.response && error.response.status === 401) {
            // unauthorized - redirect to login
            navigator.navigate("Login");
          } else if (!isConnected && !error.response?.data?.message) {
            return Promise.reject({
              response: {
                data: { message: "Offline - Please enable internet" },
              },
            });
          }
          return Promise.reject(error);
        },
      },
    ],
  },
};

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers = composeWithDevTools({});
const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    offlineMiddleWare,
    axiosMiddleware(client, axiosMiddlewareConfig),
    asyncDispatchMiddleware,
    navigateOnSuccessMiddleware
  )
);
export const store = createStore(persistedReducer, enhancer);
export const persister = persistStore(store);

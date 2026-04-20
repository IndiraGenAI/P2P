import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./combined.reducers";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login"],
  stateReconciler: autoMergeLevel2,
};
const persistedReducer: any = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action in the state
        // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        ignoredActions: [
          "login/loginUserData/fulfilled",
          "login/forcePasswordChange/fulfilled",
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        ignoredPaths: ["login.userData", "payload.user"],
      },
    }),
});

export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer, { loadUserFromStorage } from "./slices/userSlice";
import themeReducer from "./slices/themeSlice";
import { voiceReducer } from "./slices/voiceSlice";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  voice: voiceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "voice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

if (typeof window !== "undefined") {
  store.dispatch(loadUserFromStorage());
}

export type AppDispatch = typeof store.dispatch;

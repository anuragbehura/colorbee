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
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import colorReducer from "./slice/colorSlice";

// ✅ Create NoopStorage for SSR environments
const createNoopStorage = () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
});

// ✅ Use `localStorage` only if available (Next.js Safe)
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// ✅ Combine all your reducers
const rootReducer = combineReducers({
    colorPalettes: colorReducer,
});

// ✅ Configure Redux-Persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["colorPalettes"],
};

// ✅ Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure the store with TypeScript support
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// ✅ Export typed RootState & AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Export the persistor and store
export const persistor = persistStore(store);
export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
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
import postReducer from "./postSlice";


const reducers = combineReducers({
    user: userReducer,
    posts: postReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['api']
}

const persistUserReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistUserReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware)
})

export const persistor = persistStore(store)
export default store
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});
export const useAppDispatch = ()=> useDispatch()
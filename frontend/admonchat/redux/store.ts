import { configureStore } from "@reduxjs/toolkit";
import chatsReducer from "@/redux/features/chats-slice";
import chatReducer from "@/redux/features/chat-slice";
import projectReducer from "@/redux/features/project-slice";
// import settingsReducer from "@/redux/features/settings-slice";
// import viewReducer from "@/redux/features/view-slice";
// import anomalyReducer from "@/redux/features/anomaly-slice";
// import nodalReducer from "@/redux/features/nodal-slice";
// import analyzedReducer from "@/redux/features/analyzed-slice";
// import powercableReducer from "@/redux/features/power-cable-slice";
// import dataviewReducer from "@/redux/features/data-view-slice";
// import viewReducer from "@/redux/features/view-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
// import { createLogger } from "redux-logger";

export const store = configureStore({
    reducer: {
        chatsReducer,
        chatReducer,
        projectReducer
    },
    // middleware: (getDefaultMiddleware) => [
    //     ...getDefaultMiddleware()//.concat(createLogger())
    //   ]
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
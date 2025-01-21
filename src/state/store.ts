import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./error";
import settingsReducer from "./settings";
import songsReducer from "./songs";

const store = configureStore({
  reducer: {
    error: errorReducer,
    songs: songsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

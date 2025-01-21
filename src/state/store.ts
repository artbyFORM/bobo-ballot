import { configureStore, MiddlewareAPI } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

import errorReducer from "./error";
import settingsReducer from "./settings";
import songsReducer from "./songs";
import apiRoot from "../apiRoot";
import songsByRoundReducer from "./songsByRound";

const socketMiddleware = (storeAPI: MiddlewareAPI) => {
  const socket = io(apiRoot, {
    auth: {
      token: localStorage.getItem("adminKey"),
    },
  });

  socket.on("vote", (message) => {
    storeAPI.dispatch({
      type: "vote/fulfilled",
      payload: message,
    });
  });

  return (next: any) => (action: any) => {
    return next(action);
  };
};

const store = configureStore({
  reducer: {
    error: errorReducer,
    songs: songsReducer,
    songsByRound: songsByRoundReducer,
    settings: settingsReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

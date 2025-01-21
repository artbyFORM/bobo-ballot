import { createReducer } from "@reduxjs/toolkit";

const initialState = null as String | null;

const errorReducer = createReducer(initialState, (builder) => {
  builder.addMatcher(
    (action) => action.type.endsWith("/rejected"),
    (state, action: any) => {
      return action.payload;
    }
  );
});

export default errorReducer;

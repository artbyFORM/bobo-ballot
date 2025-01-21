import { createAction, createReducer } from "@reduxjs/toolkit";

/// STATE FORM
interface Settings {
  voter_id: string | null;
  round: number;
}

/// ACTIONS
const changeSettings = createAction("changeSettings");

/// REDUCER
const initialState = {
  voter_id: "abby",
  round: 1,
} satisfies Settings as Settings;

const settingsReducer = createReducer(initialState, (builder) => {
  builder.addCase(changeSettings, (state, action) => {
    return {
      ...state,
      ...action,
    };
  });
});

export type { Settings };
export { changeSettings };
export default settingsReducer;

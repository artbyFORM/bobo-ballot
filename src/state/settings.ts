import { createAction, createReducer } from "@reduxjs/toolkit";

/// SHAPE
interface Settings {
  voter_id: string | null;
  round: number;
}

/// ACTIONS
const changeSettings = createAction("changeSettings", (v: any) => {
  localStorage.setItem("bobo-ballot-settings", JSON.stringify(v));
  return v;
});

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

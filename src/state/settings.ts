import { createAction, createReducer } from "@reduxjs/toolkit";

/// SHAPE
interface Settings {
  voter_id: string | null;
  round: number;
  showArtistNames: boolean;
  showOtherVotes: boolean;
}

/// ACTIONS
const changeSettings = createAction<object>("changeSettings");

/// REDUCER
const initialState = {
  voter_id: null,
  round: 1,
  showArtistNames: true,
  showOtherVotes: true,
} satisfies Settings as Settings;

const settingsReducer = createReducer(initialState, (builder) => {
  builder.addCase(changeSettings, (state, action) => {
    const newState = {
      ...state,
      ...action.payload,
    };
    localStorage.setItem("bobo-ballot-settings", JSON.stringify(newState));
    return newState;
  });
});

export type { Settings };
export { changeSettings };
export default settingsReducer;

import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";
import apiRoot from "../apiRoot";
import { RootState } from "./store";

/// SHAPES
interface SongsByRound {
  [key: string]: [number];
}

/// ACTIONS
const getRound = createAsyncThunk<
  { round: number; songs: [number] },
  number,
  { serializedErrorType: string }
>("getRound", async (id, thunkAPI) => {
  const adminKey = localStorage.getItem("adminKey");
  if (!adminKey) return thunkAPI.rejectWithValue("You are not logged in!");
  try {
    const songs = (
      await axios(`${apiRoot}/ballot/round/${id}`, {
        headers: {
          Authorization: "Bearer " + adminKey,
        },
      })
    ).data;
    return { round: id, songs: songs.map((i: string) => Number(i)) };
  } catch (err) {
    return thunkAPI.rejectWithValue("Get song list request failed");
  }
});

/// REDUCER
const initialState = {} satisfies SongsByRound as SongsByRound;

const songsByRoundReducer = createReducer(initialState, (builder) => {
  builder.addCase(getRound.fulfilled, (state, action) => {
    state[action.payload.round] = action.payload.songs;
  });
});

/// SELECTOR
const selectNext =
  ({
    after,
    before,
    unvoted,
  }: {
    after?: number;
    before?: number;
    unvoted?: boolean;
  }) =>
  (state: RootState) => {
    const currentRound = state.songsByRound[state.settings.round];
    const condition = (id: number, index: number) => {
      let condition =
        state.songs && state.songs[id] && !state.songs[id].disqualified;
      if (condition && after) {
        condition = index > currentRound.indexOf(after);
      }
      if (condition && before) {
        condition = index < currentRound.indexOf(before);
      }
      if (condition && unvoted) {
        condition =
          !state.songs[id]?.votesByRound[state.settings.round][
            state.settings.voter_id || ""
          ];
      }
      return condition;
    };
    return before
      ? currentRound?.findLast(condition)
      : currentRound?.find(condition);
  };

export { getRound, selectNext };
export default songsByRoundReducer;

import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";
import apiRoot from "../apiRoot";

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
  if (!adminKey)
    return thunkAPI.rejectWithValue("Admin key is not configured!");
  try {
    const songs = (
      await axios(`${apiRoot}/ballot/round/${id}`, {
        headers: {
          Authorization: "Bearer " + adminKey,
        },
      })
    ).data;
    return { round: id, songs };
  } catch (err) {
    return thunkAPI.rejectWithValue("Get vote data request failed");
  }
});

/// REDUCER
const initialState = {} satisfies SongsByRound as SongsByRound;

const songsByRoundReducer = createReducer(initialState, (builder) => {
  builder.addCase(getRound.fulfilled, (state, action) => {
    state[action.payload.round] = action.payload.songs;
  });
});

export { getRound };
export default songsByRoundReducer;

import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";

/// SHAPES
interface SongMetadata {
  title: string;
  artists: string;
  duration: number;
  waveform: [number];
  audio: string;
}

interface VoteMap {
  [key: string]: {
    [key: string]: number;
  };
}

interface Song {
  id: number;
  metadata?: SongMetadata;
  votesByRound: VoteMap;
}

interface Songs {
  [key: string]: Song;
}

interface VotePayload {
  song_id: number;
  vote: {
    vote: number;
    round: number;
    voter_id: string;
    created_at: string;
  };
}

/// ACTIONS
const getBallotData = createAsyncThunk<
  Songs,
  undefined,
  { serializedErrorType: string }
>("getBallotData", async (id, thunkAPI) => {
  const adminKey = localStorage.getItem("adminKey");
  if (!adminKey)
    return thunkAPI.rejectWithValue("Admin key is not configured!");
  try {
    const ballotData = (
      await axios(`https://api.submit.artbyform.com/ballot`, {
        headers: {
          Authorization: "Bearer " + adminKey,
        },
      })
    ).data;
    let songs: Songs = {};
    for (let song of ballotData) {
      let votesByRound: VoteMap = { 1: {}, 2: {} };
      for (let vote of song.votes.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )) {
        votesByRound[vote.round][vote.voter_id] = Number(vote.vote);
      }
      songs[song.song_id] = {
        id: song.song_id,
        votesByRound,
      };
    }
    return songs;
  } catch (err) {
    return thunkAPI.rejectWithValue("Get vote data request failed");
  }
});

const getSong = createAsyncThunk<
  { song_id: number; song: SongMetadata },
  number,
  { serializedErrorType: string }
>("getSong", async (id, thunkAPI) => {
  const adminKey = localStorage.getItem("adminKey");
  if (!adminKey)
    return thunkAPI.rejectWithValue("Admin key is not configured!");
  try {
    const songData = (
      await axios(`https://api.submit.artbyform.com/admin/song/${id}`, {
        headers: {
          Authorization: "Bearer " + adminKey,
        },
      })
    ).data.data;
    const waveData = (
      await axios.post("https://api.wave.ac/graphql", {
        query: `{ track(
                        username:"form",
                        permalink:"${songData.song.waveac_id}",
                        privacyCode:"${songData.song.data.ptoken}"
                      ) { waveform } 
                    }`,
      })
    ).data.data.track.waveform;
    return {
      song_id: id,
      song: {
        title: songData.song.data.title,
        artists: songData.artists
          .map((artist: any) => artist.data.name)
          .join(", "),
        duration: songData.song.data.duration,
        audio: songData.listen,
        waveform: waveData,
      },
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Get song request failed");
  }
});

const vote = createAsyncThunk<
  VotePayload,
  { id: number; vote: number },
  { state: RootState; serializedErrorType: string }
>("vote", async (vote, thunkAPI) => {
  const adminKey = localStorage.getItem("adminKey");
  if (!adminKey)
    return thunkAPI.rejectWithValue("Admin key is not configured!");
  try {
    const settings = thunkAPI.getState().settings;
    if (!settings.voter_id)
      return thunkAPI.rejectWithValue(
        "You must configure a voter ID in settings!"
      );
    const vote_data = {
      vote: vote.vote,
      round: settings.round,
      voter_id: settings.voter_id,
    };
    // todo submit
    /*
        const res = await axios.post(
      `https://api.submit.artbyform.com/ballot/${id}/vote`,
      voteObj,
      { validateStatus: () => true }
    );
    */
    return {
      song_id: vote.id,
      vote: {
        ...vote_data,
        created_at: new Date().toString(),
      },
    };
  } catch (err) {
    return thunkAPI.rejectWithValue("Vote request failed");
  }
});

/// REDUCER
const initialState = {} satisfies Songs as Songs;

const songsReducer = createReducer(initialState, (builder) => {
  builder.addCase(getBallotData.fulfilled, (state, action) => {
    for (let id in action.payload) {
      if (state[id]) {
        state[id].votesByRound = action.payload[id].votesByRound;
      } else {
        state[id] = action.payload[id];
      }
    }
  });
  builder.addCase(getSong.fulfilled, (state, action) => {
    if (!state[action.payload.song_id]) {
      state[action.payload.song_id] = {
        id: action.payload.song_id,
        metadata: action.payload.song,
        votesByRound: { 1: {}, 2: {} },
      };
    } else {
      state[action.payload.song_id].metadata = action.payload.song;
    }
  });
  builder.addCase(vote.fulfilled, (state, action) => {
    if (state[action.payload.song_id]) {
      state[action.payload.song_id].votesByRound[action.payload.vote.round][
        action.payload.vote.voter_id
      ] = action.payload.vote.vote;
    }
  });
});

export { getBallotData, getSong, vote };
export default songsReducer;

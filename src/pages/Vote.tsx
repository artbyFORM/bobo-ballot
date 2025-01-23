import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";

import {
  Chip,
  Link,
  Tooltip,
  Stack,
  Slider,
  Box,
  IconButton,
} from "@mui/material";
import {
  ArrowForward,
  ArrowBack,
  VolumeDown,
  VolumeUp,
} from "@mui/icons-material";

import { useTheme } from "../ThemeContext";
import { AppDispatch, RootState } from "../state/store";
import { getSong, vote } from "../state/songs";
import { getRound, selectNext } from "../state/songsByRound";

import Waveform from "../components/Waveform";
import Comments from "../components/Comments";

const votesByRound = [[], [1, 2, 3], [1, 2, 3, 4, 5]];

const Vote: React.FC = () => {
  const navigate = useNavigate();

  // LOCAL STATE
  const [volume, setVolume] = useState<number>(1);
  const id = Number(useParams().id);

  // GLOBAL STATE
  const { isDarkMode } = useTheme();
  const songData = useSelector((state: RootState) => state.songs[id]?.metadata);
  const currentVote = useSelector((state: RootState) =>
    state.settings.voter_id
      ? state.songs[id]?.votesByRound[state.settings.round][
          state.settings.voter_id
        ]
      : 0
  );
  const r1Votes = useSelector(
    (state: RootState) => state.songs[id]?.votesByRound[1]
  );
  const allVotes = useSelector(
    (state: RootState) => state.songs[id]?.votesByRound[state.settings.round]
  );
  const settings = useSelector((state: RootState) => state.settings);
  const currentRound = useSelector((state: RootState) => state.settings.round);
  const songsInRound = useSelector(
    (state: RootState) => state.songsByRound[state.settings.round]
  );
  const validVoteKeys = useSelector(
    (state: RootState) => votesByRound[state.settings.round]
  );

  const positionInRound = songsInRound?.indexOf(id);
  const prev = useSelector(selectNext({ before: id }));
  const next = useSelector(selectNext({ after: id }));

  // ACTIONS
  const dispatch: AppDispatch = useDispatch();
  const submitVote = (v: number) => dispatch(vote({ id, vote: v }));
  useEffect(() => {
    if (!songData || !songData.waveform || !songData.audio)
      dispatch(getSong(id));
    // preload the next song, or refresh the round if we're at the end
    if (songsInRound) {
      if (!next) {
        dispatch(getRound(currentRound));
      } else {
        dispatch(getSong(next));
      }
    }
    // eslint-disable-next-line
  }, [id, dispatch]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        navigate("/vote/" + next);
      }
      const key = Number(event.key);
      if (validVoteKeys.includes(key) && key !== currentVote) {
        submitVote(key);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line
  }, [currentVote, validVoteKeys, next]);

  const onVolumeChange = (event: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center p-15 w-full h-full">
        {songsInRound && (
          <IconButton
            className="size-5 ml-10"
            onClick={() => navigate("/vote/" + prev)}
            disabled={!prev}
          >
            <ArrowBack />
          </IconButton>
        )}
        {(!songData ||
          !songsInRound ||
          !songData.waveform ||
          !songData.audio) && <h1 className="text-xl font-bold">Loading...</h1>}
        {songData && songData.waveform && songData.audio && (
          <div className="flex justify-center items-center p-15 w-full h-full">
            <div className="flex flex-col items-center space-y-15">
              <h1 className="text-xl font-bold">{`${positionInRound + 1}/${
                songsInRound?.length
              }`}</h1>
              <h1 className="text-4xl font-extrabold pt-5 pb-5">
                {songData.title}
              </h1>
              {settings.showArtistNames && (
                <h1 className="text-4xl font-light pb-5">{songData.artists}</h1>
              )}
              <h1 className="text-l font-light pb-5">
                view on:{" "}
                <Link
                  sx={{ textDecoration: "none" }}
                  target="_blank"
                  href={`https://submit.artbyform.com/admin/music/${id}`}
                >
                  submit.artbyform.com
                </Link>{" "}
                •{" "}
                <Link
                  sx={{ textDecoration: "none" }}
                  target="_blank"
                  href={`https://s.wave.ac/form/${songData.waveac}`}
                >
                  wave.ac
                </Link>
              </h1>
              <Box
                className="w-900 h-200 pt-5 pb-5"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Waveform
                  key={`waveform-${id}`}
                  url={songData.audio}
                  waveform={songData.waveform}
                  duration={songData.duration}
                  volume={volume}
                />
                <Stack spacing={2} direction="row" sx={{ my: 3, width: 300 }}>
                  <VolumeDown />
                  <Slider
                    min={0}
                    max={1}
                    step={0.025}
                    aria-label="Volume"
                    value={volume}
                    onChange={onVolumeChange}
                    sx={{ color: isDarkMode ? "white" : "black", width: 300 }}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
              {settings.showOtherVotes &&
                (Object.values(allVotes).length > 0 ? (
                  <div className="text-neutral-400 text-m font-bold pb-4">
                    average vote:{" "}
                    {Number(
                      (
                        Object.values(allVotes).reduce((a, b) => a + b, 0) /
                        Object.values(allVotes).length
                      ).toFixed(3)
                    )}
                  </div>
                ) : (
                  <div className="text-neutral-400 text-m font-bold pb-4">
                    no votes yet
                  </div>
                ))}
              <div className="flex pb-5 gap-10">
                {validVoteKeys.map((key) => {
                  let votes = Object.keys(allVotes).filter(
                    (i) => allVotes[i] === key
                  );
                  console.log(r1Votes);
                  let r1 = Object.keys(r1Votes).filter(
                    (i) => r1Votes[i] === key
                  );
                  return (
                    <div className="flex flex-col" key={key}>
                      <button
                        className={`rounded-full text-4xl size-24 px-5 ${
                          currentVote === key
                            ? "bg-pink-500 text-white"
                            : "bg-slate-100 text-black"
                        }`}
                        onClick={() => submitVote(key)}
                      >
                        {key}
                      </button>
                      {settings.showOtherVotes && (
                        <Tooltip title={`${votes.join(", ")}`}>
                          <Chip
                            className="mt-3 self-center"
                            sx={{ cursor: "default", fontWeight: "bold" }}
                            label={`${votes.length} vote${
                              votes.length !== 1 ? "s" : ""
                            }`}
                          />
                        </Tooltip>
                      )}
                      {currentRound === 2 &&
                        settings.showOtherVotes &&
                        key <= 3 && (
                          <Tooltip title={`${r1.join(", ")}`}>
                            <Chip
                              className="mt-3 self-center"
                              sx={{
                                cursor: "default",
                                fontWeight: "light",
                                fontSize: "12px",
                              }}
                              label={`${r1.length} vote${
                                r1.length !== 1 ? "s" : ""
                              }`}
                            />
                          </Tooltip>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {songsInRound && (
          <IconButton
            className="size-5 mr-10"
            onClick={() => navigate("/vote/" + next)}
            disabled={!next}
          >
            <ArrowForward />
          </IconButton>
        )}
      </div>
      <Comments id={id} />
    </div>
  );
};

export default Vote;

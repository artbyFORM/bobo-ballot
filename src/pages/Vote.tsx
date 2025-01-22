import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";

import { useTheme } from "../ThemeContext";
import { AppDispatch, RootState } from "../state/store";
import { getSong, vote } from "../state/songs";
import { getRound, selectNext } from "../state/songsByRound";

import Waveform from "../components/Waveform";
import Comments from "../components/Comments";
import { Link } from "@mui/material";

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
    if (!songData) dispatch(getSong(id));
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
            <ArrowBackIcon />
          </IconButton>
        )}
        {(!songData || !songsInRound) && (
          <h1 className="text-xl font-bold">Loading...</h1>
        )}
        {songData && (
          <div className="flex justify-center items-center p-15 w-full h-full">
            <div className="flex flex-col items-center space-y-15">
              <h1 className="text-xl font-bold">{`${positionInRound + 1}/${
                songsInRound?.length
              }`}</h1>
              <h1 className="text-4xl font-extrabold pt-5 pb-5">
                {songData.title}
              </h1>
              <h1 className="text-4xl font-light pb-5">{songData.artists}</h1>
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
                className="w-900 h-200 pt-5 pb-10"
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
              <div className="flex pb-5 gap-10">
                {validVoteKeys.map((key) => (
                  <button
                    key={`vote-button-${key}`}
                    className={`rounded-full text-4xl size-24 px-5 ${
                      currentVote === key
                        ? "bg-pink-500 text-white"
                        : "bg-slate-100 text-black"
                    }`}
                    onClick={() => submitVote(key)}
                  >
                    {key}
                  </button>
                ))}
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
            <ArrowForwardIcon />
          </IconButton>
        )}
      </div>
      <Comments id={id} />
    </div>
  );
};

export default Vote;

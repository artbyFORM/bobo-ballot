import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import Waveform from "../components/Waveform";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

import axios, { all } from "axios";
import Box from "@mui/material/Box";

const validVoteKeys = [1, 2, 3, 4, 5]; // TODO: make this based on current round

const Vote: React.FC = () => {
  const [id, setId] = useState<number>(17);
  const totalRows = 562; // hard coded for now

  const [allVotes, setAllVotes] = useState<any>([]);

  const [currentVote, setCurrentVote] = useState<number>(-1);
  const [currentSongData, setCurrentSongData] = useState<any>(null);
  const [currentSongWaveform, setCurrentSongWaveform] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) console.error("Admin key not found");
    axios.defaults.headers.common["Authorization"] = "Bearer " + adminKey;

    //get all vote data
    axios
      .get("https://api.submit.artbyform.com/ballot")
      .then((res) => {
        setAllVotes(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      axios.defaults.headers.common["Authorization"] = null;
    };
  }, []);

  useEffect(() => {
    async function getSong() {
      try {
        const songData = await axios
          .get(`https://api.submit.artbyform.com/admin/song/${id}`)
          .then((res) => {
            return res.data.data;
          });

        const waveData = await axios
          .post("https://api.wave.ac/graphql", {
            query: `{ track(
                        username:"form",
                        permalink:"${songData.song.waveac_id}",
                        privacyCode:"${songData.song.data.ptoken}"
                      ) { waveform } 
                    }`,
          })
          .then((res) => {
            return res.data.data.track.waveform;
          });

        setCurrentSongData(songData);
        setCurrentSongWaveform(waveData);

        // set currentVote to most recent vote for this song from the current user - if it exists
        const songVotes = allVotes.find((vote: any) => vote.song_id === id);
        const vote = songVotes?.votes
          .filter((vote: any) => vote.voter_id === "abby")
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )[0];
        if (vote) {
          console.log(
            `the latest for vote for song ${id} by ${vote.voter_id} was ${vote.vote}`
          );
          setCurrentVote(Math.floor(vote.vote));
        }
      } catch (error) {
        console.error("Error fetching song data:", error);
      }
      setLoading(false);
    }

    getSong();
  }, [id, allVotes]);

  useEffect(() => {
    console.log("Current vote updated:", currentVote);
  }, [currentVote]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = Number(event.key);
      if (validVoteKeys.includes(key) && key !== currentVote) {
        submitVote(key);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentVote]);

  const changeId = (newRow: number) => {
    setId(newRow);
  };

  const submitVote = async (vote: number) => {
    // TODO: submit vote to backend
    const voteObj = {
      vote: vote,
      voter_id: "abby", // TODO: get this from current user
      round: 1,
    };

    console.log(`sending ${voteObj} to /ballot/${id}/vote`);

    const res = await axios.post(
      `https://api.submit.artbyform.com/ballot/${id}/vote`,
      voteObj,
      { validateStatus: () => true }
    );
    console.log(res);

    setCurrentVote(vote);
  };

  const onVolumeChange = (event: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <div className="flex justify-between items-center p-15 w-full h-full">
        <IconButton
          className="size-5 ml-10"
          onClick={() => changeId(id - 1)}
          disabled={id === 1}
        >
          <ArrowBackIcon />
        </IconButton>
        <div className="flex justify-center items-center p-15 w-full h-full">
          <div className="flex flex-col items-center space-y-15">
            <h1 className="text-xl font-bold">{`${id}/${totalRows}`}</h1>
            {id ? (
              <h1 className="text-4xl font-extrabold pt-5 pb-5">
                {currentSongData.song.data.title}
              </h1>
            ) : (
              "..."
            )}
            {id ? (
              <h1 className="text-4xl font-light pb-5">
                {currentSongData.artists[0].data.name}
              </h1>
            ) : (
              "..."
            )}
            {id ? (
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
                  url={currentSongData.listen}
                  waveform={currentSongWaveform}
                  duration={currentSongData.song.data.duration}
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
                    sx={{ color: "black", width: 300 }}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
            ) : null}
            <div className="flex pb-5">
              {validVoteKeys.map((key) => (
                <button
                  key={`vote-button-${key}`}
                  className={`rounded-full text-4xl size-24 px-5 mr-10 ${
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
        <IconButton
          className="size-5 mr-10"
          onClick={() => changeId(id + 1)}
          disabled={id === totalRows}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Vote;

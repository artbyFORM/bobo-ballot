import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Card,
  CardActionArea,
  Chip,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { RootState } from "../state/store";

const Songs: React.FC = () => {
  // LOCAL STATE
  let [sort, setSort] = useState<string>("order");
  let [search, setSearch] = useState<string>("");
  let [filterNote, setFilterNote] = useState<string>("");
  let [filterFlag, setFilterFlag] = useState<boolean>(false);

  // GLOBAL STATE
  const privateComments = JSON.parse(
    localStorage.getItem("privateComments") || "{}"
  );
  const songData = useSelector((state: RootState) => state.songs);
  const settings = useSelector((state: RootState) => state.settings);
  const currentRound = useSelector((state: RootState) => state.settings.round);
  const songsInRound = useSelector(
    (state: RootState) => state.songsByRound[state.settings.round]
  );

  let average = (id: number) => {
    let votes = songData[id]?.votesByRound[currentRound];
    return Object.keys(votes).length > 0
      ? Number(
          (
            Object.values(votes).reduce((a, b) => a + b, 0) /
            Object.values(votes).length
          ).toFixed(3)
        )
      : 0;
  };

  let total = (id: number) => {
    let votes = songData[id]?.votesByRound[currentRound];
    return Number(
      Object.values(votes)
        .reduce((a, b) => a + b, 0)
        .toFixed(3)
    );
  };

  let your = (id: number) =>
    songData[id]?.votesByRound[currentRound][settings.voter_id || ""] || 0;

  let sortingFunctions: { [key: string]: (a: number, b: number) => number } = {
    average: (a, b) => average(b) - average(a),
    total: (a, b) => total(b) - total(a),
    your: (a, b) => your(b) - your(a),
  };

  return (
    <div className="max-w-6xl m-auto w-full p-10">
      <div className="flex justify-between items-center w-full mb-5">
        <h2 className="text-2xl font-bold mt-5 mb-5 flex items-center">
          round {currentRound} songs ({songsInRound?.length})
        </h2>
        <div>
          <FormControl>
            <ToggleButtonGroup
              color="primary"
              value={sort}
              exclusive
              onChange={(e, sort) => {
                if (sort) setSort(sort);
              }}
            >
              <ToggleButton value="order">Round order</ToggleButton>
              {settings.showOtherVotes && (
                <ToggleButton value="average">Average vote</ToggleButton>
              )}
              {settings.showOtherVotes && (
                <ToggleButton value="total">Total vote</ToggleButton>
              )}
              <ToggleButton value="your">Your vote</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </div>
      </div>
      <div className="flex gap-10 items-center mb-5">
        <FormControl fullWidth className="flex-1">
          <TextField
            label="Search"
            className="flex-1 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth className="flex-1">
          <TextField
            label="Search private notes"
            className="flex-1 w-full"
            value={filterNote}
            onChange={(e) => setFilterNote(e.target.value)}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={filterFlag}
              onChange={() => setFilterFlag(!filterFlag)}
            />
          }
          label="Songs I've flagged"
        />
      </div>
      <div>
        {(sort === "order"
          ? songsInRound
          : songsInRound.toSorted(sortingFunctions[sort])
        )
          ?.filter((i) => {
            let f = filterFlag
              ? privateComments[i] && privateComments[i].flagged
              : true;
            if (f)
              f =
                (songData[i]?.metadata?.title || "")
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                (songData[i]?.metadata?.artists || "")
                  .toLowerCase()
                  .includes(search.toLowerCase());
            if (f)
              f = (privateComments[i]?.comment?.toLowerCase() || "").includes(
                filterNote.toLowerCase()
              );
            return f;
          })
          .map((i) => {
            let votes = songData[i]?.votesByRound[currentRound];
            return (
              <Link to={"/vote/" + i} key={i}>
                <Card variant="outlined" className="mb-2">
                  <CardActionArea>
                    {songData[i] && (
                      <div className="p-4 flex justify-between">
                        <div className="flex">
                          <div className="w-16">
                            <h4 className="text-m font-bold">
                              #{songsInRound.indexOf(i) + 1}
                            </h4>
                            <small className="text-xs font-bold text-neutral-400">
                              ID {i}
                            </small>
                          </div>
                          <div>
                            <h3 className="font-bold">
                              {songData[i].metadata?.title}
                              {songData[i].disqualified && (
                                <Chip
                                  label="Disqualified"
                                  color="error"
                                  size="small"
                                  sx={{ marginLeft: "10px" }}
                                />
                              )}
                            </h3>
                            {settings.showArtistNames && (
                              <p className="text-sm font-light">
                                {songData[i].metadata?.artists}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          {settings.showOtherVotes && (
                            <div className="mr-5">
                              <small className="text-xs font-bold text-neutral-400">
                                VOTES
                              </small>
                              <p className="font-bold">
                                {Object.keys(votes).length}
                              </p>
                            </div>
                          )}
                          {settings.showOtherVotes && (
                            <div className="mr-5">
                              <small className="text-xs font-bold text-neutral-400">
                                AVERAGE
                              </small>
                              <p className="font-bold">
                                {Object.keys(votes).length > 0
                                  ? average(i)
                                  : "N/A"}
                              </p>
                            </div>
                          )}
                          {settings.showOtherVotes && (
                            <div className="mr-5">
                              <small className="text-xs font-bold text-neutral-400">
                                TOTAL
                              </small>
                              <p className="font-bold">{total(i)}</p>
                            </div>
                          )}
                          <div className="mr-5">
                            <small className="text-xs font-bold text-neutral-400">
                              YOU
                            </small>
                            <Typography
                              color="primary"
                              sx={{ fontWeight: "bold" }}
                            >
                              {votes[settings.voter_id || ""] || "0"}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardActionArea>
                </Card>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Songs;

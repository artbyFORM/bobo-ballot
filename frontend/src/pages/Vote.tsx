import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import Waveform from '../components/Waveform';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const validVoteKeys = [1, 2, 3, 4, 5]; // TODO: make this based on current round

const Vote: React.FC = () => {
  const [row, setRow] = useState<number>(1);
  const totalRows = 12; // hard coded for now
  const [vote, setVote] = useState<number>(1);

  const [trackURL, setTrackURL] = useState("https://r2.minecraft.college/Skrillex%20-%20First%20Of%20The%20Year%20(Equinox).wav");

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = Number(event.key);
      if (validVoteKeys.includes(key) && key !== vote) {
        submitVote(key);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [vote]); // Added dependency array

  const changeRow = (newRow: number) => {
    setRow(newRow);
  };

  const submitVote = async (vote: number) => {
    setVote(vote);
  };

  return (
    <div className='p-10'>
      <div className="flex justify-between items-center p-15 w-full h-full">
        <IconButton className="size-5 ml-10" onClick={() => changeRow(row - 1)} disabled={row === 1}><ArrowBackIcon /></IconButton>
        <div className="flex justify-center items-center p-15 w-full h-full">
          <div className="flex flex-col items-center space-y-15">
            <h1 className="text-xl font-bold">{`${row}/${totalRows}`}</h1>
            {row ? <h1 className="text-4xl font-extrabold pt-5 pb-5">{"Bangarang (feat. Sirah)"}</h1> : "..."}
            {row ? <h1 className="text-4xl font-light pb-5">{"Skrillex"}</h1> : "..."}
            {row ? (
              <div className="w-900 h-200 pt-5 pb-10">
                <Waveform key={`waveform-${row}`} url={trackURL} />
              </div>
            ) : null}
            <div className="flex pb-5">
              {validVoteKeys.map((key) => (
                <button key={`vote-button-${key}`} className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === key ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => submitVote(key)}>{key}</button>
              ))}
            </div>
          </div>
        </div>
        <IconButton className="size-5 mr-10" onClick={() => changeRow(row + 1)} disabled={row === totalRows}><ArrowForwardIcon /></IconButton>
      </div>
    </div>
  );
};

export default Vote;

import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useEffect, useState } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const validVoteKeys = [1, 2, 3, 4, 5]; //TODO: make this based on current round

const Vote: React.FC = () => {
  const [row, setRow] = useState<number>(1);
  const totalRows = 12; //hard coded for now

  const [vote, setVote] = useState<number>(1);

  // handle keyboard input
  useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
          const key = Number(event.key);
          if (validVoteKeys.includes(key) && key !== vote){
            submitVote(key);
          }
      };

      document.addEventListener('keydown', handleKeyPress);

      return () => {
          document.removeEventListener('keydown', handleKeyPress);
      };
  });

  const changeRow = (newRow: number) => {
    setRow(newRow);
  };

  const submitVote = async (vote: number) => {
    setVote(vote);
  };

  /*if (loading) {
      return (
          <div className='flex justify-center items-center w-full h-20'>
              <div className='flex flex-col justify-center items-center space-y-5'>
                  <span className="loading loading-dots loading-lg pb-15"></span>
                  Loading submissions...
              </div>
          </div>
      );
  }*/

  return (
      <div className='p-10'>
          <div className="flex justify-between items-center p-15 w-full h-full">
              <IconButton className="size-5 ml-10" onClick={() => changeRow(row - 1)} disabled={row === 1}><ArrowBackIcon/></IconButton>
              <div className="flex justify-center items-center p-15 w-full h-full">
              <div className="flex flex-col items-center p-15 space-y-15">
                  <p>{`${row}/${totalRows}`}</p>
                  {/*TODO: fix placeholder text*/}
                  {/*TODO: dynamically size font to fit*/}
                  {row ? <h1 className="text-4xl font-extrabold pt-5 pb-5">{"The Devil's Den"}</h1> : "..."}
                  {row ? <h1 className="text-4xl font-light pb-5">{"Skrillex & Wolfgang Gartner"}</h1> : "..."}
                  <div className="w-10 h-50"/>
                  <div className="flex pb-5">
                      {validVoteKeys.map((key) => (
                            <button className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === Number(key) ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => submitVote(Number(key))}>{key}</button>
                      ))}
                  </div>
              </div>
          </div>
              <IconButton className="size-5 mr-10" onClick={() => changeRow(row + 1)} disabled={row === totalRows}><ArrowForwardIcon/></IconButton>
          </div>
      </div>
  );
};

export default Vote;
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useEffect, useState } from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Vote: React.FC = () => {
  const [row, setRow] = useState<number>(1);
  const totalRows = 12; //hard coded for now
  const [vote, setVote] = useState('1');

  // handle keyboard input
  useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
          if (event.key === '1' || event.key === '2' || event.key === '3') {
              handleSubmit(event.key);
          }
      };

      document.addEventListener('keydown', handleKeyPress);

      return () => {
          document.removeEventListener('keydown', handleKeyPress);
      };
  }, []);

  const changeRow = (newRow: number) => {
    setRow(newRow);
  };

  const handleSubmit = async (vote: string) => {
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
              <IconButton className="btn ml-10" onClick={() => changeRow(row - 1)} disabled={row === 1}><ArrowBackIcon/></IconButton>
              <IconButton className="btn mr-10" onClick={() => changeRow(row + 1)} disabled={row === totalRows}><ArrowForwardIcon/></IconButton>
          </div>

          <div className="flex justify-center items-center p-15 w-full h-full">
              <div className="flex flex-col items-center p-15 space-y-15">
                  <p>{`${row}/${totalRows}`}</p>
                  {/*TODO: fix placeholder text*/}
                  {/*TODO: dynamically size font to fit*/}
                  {row ? <h1 className="text-4xl font-extrabold pt-5 pb-5">{"The Devil's Den"}</h1> : "..."}
                  {row ? <h1 className="text-4xl font-light pb-5">{"Skrillex & Wolfgang Gartner"}</h1> : "..."}
                  <div className="w-10 h-50"/>
                  <div className="flex pb-5">
                      <button className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === '1' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => handleSubmit('1')}>1</button>
                      <button className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === '2' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => handleSubmit('2')}>2</button>
                      <button className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === '3' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => handleSubmit('3')}>3</button>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Vote;
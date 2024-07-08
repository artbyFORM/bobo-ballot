import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import Waveform from '../components/Waveform';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from 'axios';

const validVoteKeys = [1, 2, 3, 4, 5]; // TODO: make this based on current round

const Vote: React.FC = () => {
  const [id, setId] = useState<number>(103);
  const totalRows = 999; // hard coded for now
  const [vote, setVote] = useState<number>(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getSong() {
        const admkey = process.env.REACT_APP_ADMIN_KEY;
        if (!admkey) return;
        
        const info = await axios.get(`https://api.submit.artbyform.com/admin/song/${id}`, {
            headers: { Authorization: "Bearer " + admkey },
            validateStatus: () => true,
        });

        //if (!info.data.success) return setErr(info.data.message);
        setData(info.data.data);
        console.log(info.data.data.listen);
        setLoading(false);
    }

    getSong();
  }, [id]);


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

  const changeId = (newRow: number) => {
    setId(newRow);
  };

  const submitVote = async (vote: number) => {
    setVote(vote);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-10'>
      <div className="flex justify-between items-center p-15 w-full h-full">
        <IconButton className="size-5 ml-10" onClick={() => changeId(id - 1)} disabled={id === 1}><ArrowBackIcon /></IconButton>
        <div className="flex justify-center items-center p-15 w-full h-full">
          <div className="flex flex-col items-center space-y-15">
            <h1 className="text-xl font-bold">{`${id}/${totalRows}`}</h1>
            {id ? <h1 className="text-4xl font-extrabold pt-5 pb-5">{data.song.data.title}</h1> : "..."}
            {id ? <h1 className="text-4xl font-light pb-5">{data.artists[0].data.name}</h1> : "..."}
            {id ? (
              <div className="w-900 h-200 pt-5 pb-10">
                <Waveform key={`waveform-${id}`} url={data.listen} />
              </div>
            ) : null}
            <div className="flex pb-5">
              {validVoteKeys.map((key) => (
                <button key={`vote-button-${key}`} className={`rounded-full text-4xl size-24 px-5 mr-10 ${vote === key ? 'bg-pink-500 text-white' : 'bg-slate-100 text-black'}`} onClick={() => submitVote(key)}>{key}</button>
              ))}
            </div>
          </div>
        </div>
        <IconButton className="size-5 mr-10" onClick={() => changeId(id + 1)} disabled={id === totalRows}><ArrowForwardIcon /></IconButton>
      </div>
    </div>
  );
};

export default Vote;

import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import Waveform from '../components/Waveform';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

import axios from 'axios';
import Box from '@mui/material/Box';

const validVoteKeys = [1, 2, 3, 4, 5]; // TODO: make this based on current round

const Vote: React.FC = () => {
  const [id, setId] = useState<number>(17);
  const totalRows = 562; // hard coded for now
  const [vote, setVote] = useState<number>(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);
  const [waveform, setWaveform] = useState<any>([]);

  useEffect(() => {
    async function getSong() {
        const admkey = process.env.REACT_APP_ADMIN_KEY;
        if (!admkey) return;
        
        const info = await axios.get(`https://api.submit.artbyform.com/admin/song/${id}`, 
          { headers: { Authorization: "Bearer " + admkey },
          validateStatus: () => true,
        });

        const waveData = await axios.post('https://api.wave.ac/graphql', 
          { query: `{ track(username:"form",permalink:"${info.data.data.song.waveac_id}",privacyCode:"${info.data.data.song.data.ptoken}") { waveform } }` }, 
          { headers: { Authorization: "Bearer " + admkey },
        });

        //if (!info.data.success) return setErr(info.data.message);
        setData(info.data.data);
        setWaveform(waveData.data.data.track.waveform);
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

  const onVolumeChange = (event: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
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
                <Box className="w-900 h-200 pt-5 pb-10" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Waveform key={`waveform-${id}`} url={data.listen} waveform={waveform} duration={data.song.data.duration} volume={volume} />
                  <Stack spacing={2} direction="row" sx={{ my: 3, width: 300}}>
                    <VolumeDown />
                    <Slider min={0} max={1} step={0.025} aria-label="Volume" value={volume} onChange={onVolumeChange} sx={{ color:"black", width: 300 }} />
                    <VolumeUp />
                  </Stack>
                </Box>
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

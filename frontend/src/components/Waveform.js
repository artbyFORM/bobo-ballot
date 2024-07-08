import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/base";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import WaveSurfer from "wavesurfer.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: "#eee",
    progressColor: "#EC4899",
    cursorColor: "#EC4899",
    barWidth: 3,
    barRadius: 10,
    responsive: true,
    height: 100,
    normalize: true,
    minPxPerSec: 3, 
    pixelRatio: 1,
    partialRender: true,
    plugins: [
        Hover.create({
          lineColor: '#EC4899',
          lineWidth: 2,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
        }),
      ],
});

export default function Waveform({ url }) {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const setupWaveSurfer = async () => {
            if (!wavesurfer.current) {
                const options = formWaveSurferOptions(waveformRef.current);
                wavesurfer.current = WaveSurfer.create(options);
                wavesurfer.current.on("ready", () => {
                    if (wavesurfer.current) {
                        wavesurfer.current.setVolume(volume);
                        setDuration(wavesurfer.current.getDuration());
                    }
                });
                wavesurfer.current.on("audioprocess", () => {
                    if (wavesurfer.current) {
                        // reset the play head to start when it reaches the end
                        if (wavesurfer.current.getCurrentTime() >= wavesurfer.current.getDuration()) {
                            wavesurfer.current.seekTo(0);
                            handlePlayPause();
                        }
                        setCurrentTime(wavesurfer.current.getCurrentTime());
                    }
                });
                wavesurfer.current.on("error", (error) => {
                    console.error("error loading WaveSurfer:", error);
                });
            }

            try {
                await wavesurfer.current.load(`http://localhost:3001/proxy?url=${url}`);
            } catch (error) {
                console.error("error loading URL for WaveSurfer:", error);
            }
        };

        setupWaveSurfer();

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.un('audioprocess');
                wavesurfer.current.un('ready');
                wavesurfer.current.destroy();
                wavesurfer.current = null;
            }
        };
    }, [url]);

    const handlePlayPause = () => {
        setPlaying(prevPlaying => !prevPlaying);
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
        }
    };

    const handleSkipBack = () => {
        if (wavesurfer.current) {
            setCurrentTime(wavesurfer.current.getCurrentTime() - 5);
            wavesurfer.current.seekTo((currentTime - 5) / duration);
        }
    }

    const handleSkipForward = () => {
        if (wavesurfer.current) {
            setCurrentTime(wavesurfer.current.getCurrentTime() + 5);
            wavesurfer.current.seekTo((currentTime + 5) / duration);
        }
    }

    const onVolumeChange = (e) => {
        const newVolume = +e.target.value;
        if (wavesurfer.current) {
            setVolume(newVolume);
            wavesurfer.current.setVolume(newVolume);
        }
    };

    function formatTime(seconds) {
        let date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
    }

    return (
        <div style={{ width: "900px"}}>
            <div id="waveform" ref={waveformRef} />
            <p className="flex justify-center text-l pt-7">{`${formatTime(currentTime)} / ${formatTime(duration)}`}</p>
            <div className="flex justify-center">
                <div style={{ width:"900px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className="controls">
                    
                    <div className="pt-5" style={{ display: "flex", justifyContent: "space-between", width: "300px" }}>
                        <Button className="rounded-full text-4xl size-30" onClick={handleSkipBack}>
                            <FastRewindIcon fontSize="large" />
                        </Button>
                        <Button className="rounded-full text-4xl size-30" onClick={handlePlayPause}>
                            {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                        </Button>
                        <Button className="rounded-full text-4xl size-30" onClick={handleSkipForward}>
                            <FastForwardIcon fontSize="large" />
                        </Button>
                    </div>

                    <div className="mt-5">
                        <Stack spacing={2} direction="row" sx={{ mb: 1, width: 300 }} alignItems="center">
                            <VolumeDown />
                            <Slider width={100} color="pink" min={0} max={1} step={.025} aria-label="Volume" value={volume} onChange={onVolumeChange} />
                            <VolumeUp />
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    );
}

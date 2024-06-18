import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/base";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import WaveSurfer from "wavesurfer.js";

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
    partialRender: true
});

export default function Waveform({ url }) {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        setPlay(false);

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        wavesurfer.current.load(url);
        wavesurfer.current.on("ready", function() {
            if (wavesurfer.current) {
                wavesurfer.current.setVolume(volume);
                setVolume(volume);
            }
        });
        
        return () => wavesurfer.current.destroy();
    }, [url]);

    const handlePlayPause = () => {
        setPlay(!playing);
        wavesurfer.current.playPause();
    };

    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;

        if (newVolume) {
            setVolume(newVolume);
            wavesurfer.current.setVolume(newVolume || 1);
        }
    };

    return (
        <div style={{ width: "900px"}}>
            <div id="waveform" ref={waveformRef} />
            <div style={{display: "flex", flexDirection: "column", alignItems: "center" }} className="controls">
                <Button className="rounded-full text-4xl pt-10 size-30" onClick={handlePlayPause}>
                    {playing ? <PauseIcon fontSize="xl30"/> : <PlayArrowIcon fontSize="xl30"/>}
                </Button>
                {/*
                <input
                    type="range"
                    id="volume"
                    name="volume"
                    // waveSurfer recognize value of `0` same as `1`
                    //  so we need to set some zero-ish value for silence
                    min="0.01"
                    max="1"
                    step=".025"
                    onChange={onVolumeChange}
                    defaultValue={volume}
                />
                */}
            </div>
        </div>
    );
}

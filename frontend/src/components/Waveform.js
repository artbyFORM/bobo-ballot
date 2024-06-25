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
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        const setupWaveSurfer = async () => {
            if (!wavesurfer.current) {
                const options = formWaveSurferOptions(waveformRef.current);
                wavesurfer.current = WaveSurfer.create(options);
                wavesurfer.current.on("ready", () => {
                    if (wavesurfer.current) {
                        wavesurfer.current.setVolume(volume);
                    }
                });
                wavesurfer.current.on("error", (error) => {
                    console.error("error loading WaveSurfer:", error);
                });
            }

            try {
                await wavesurfer.current.load(url);
            } catch (error) {
                console.error("error loading URL for WaveSurfer:", error);
            }
        };

        setupWaveSurfer();

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
                wavesurfer.current = null;
            }
        };
    }, [url, volume]);

    const handlePlayPause = () => {
        setPlaying(!playing);
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
        }
    };

    const onVolumeChange = (e) => {
        const newVolume = +e.target.value;
        setVolume(newVolume);
        if (wavesurfer.current) {
            wavesurfer.current.setVolume(newVolume);
        }
    };

    return (
        <div style={{ width: "900px"}}>
            <div id="waveform" ref={waveformRef} />
            <div style={{display: "flex", flexDirection: "column", alignItems: "center" }} className="controls">
                <Button className="rounded-full text-4xl pt-10 size-30" onClick={handlePlayPause}>
                    {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </Button>
                {/* Uncomment this section for volume control if needed */}
                {/* <input
                    type="range"
                    id="volume"
                    name="volume"
                    min="0.01"
                    max="1"
                    step=".025"
                    onChange={onVolumeChange}
                    defaultValue={volume}
                /> */}
            </div>
        </div>
    );
}

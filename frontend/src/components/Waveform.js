import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/base";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

const formWaveSurferOptions = (ref) => ({
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
  backend: "MediaElement",
  partialRender: true,
  plugins: [
    Hover.create({
      lineColor: "#EC4899",
      lineWidth: 2,
      labelBackground: "#555",
      labelColor: "#fff",
      labelSize: "11px",
    }),
  ],
});

export default function Waveform({ url, waveform, duration, volume }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const setupWaveSurfer = async () => {
      if (!wavesurfer.current) {
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
      }

      try {
        await wavesurfer.current.load(url, waveform);
        if (wavesurfer.current) {
          wavesurfer.current.setVolume(volume);
          wavesurfer.current.on("play", () => {
            setPlaying(true);
          });
          wavesurfer.current.on("pause", () => {
            setPlaying(false);
          });
          wavesurfer.current.on("ready", () => {
            setCurrentTime(0);
          });
          wavesurfer.current.on("audioprocess", () => {
            if (wavesurfer.current.getCurrentTime() < duration) {
              setCurrentTime(wavesurfer.current.getCurrentTime());
            }
            // reset the play head to start when it reaches the end
            if (wavesurfer.current.getCurrentTime() >= duration) {
              wavesurfer.current.pause();
              wavesurfer.current.seekTo(0);
              setCurrentTime(0);
            }
          });
          wavesurfer.current.on("error", (error) => {
            console.error("error loading WaveSurfer:", error);
          });
        }
      } catch (error) {
        console.error("error loading URL for WaveSurfer:", error);
      }
    };

    setupWaveSurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.un("audioprocess");
        wavesurfer.current.un("ready");
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, waveform]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      const isPlaying = wavesurfer.current.isPlaying();
      setPlaying(!isPlaying);
      if (isPlaying) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
    }
  };

  const handleSkipBack = () => {
    if (wavesurfer.current) {
      const newTime = wavesurfer.current.getCurrentTime() - 5;
      const currentTimeInRange = Math.max(0, newTime);
      setCurrentTime(currentTimeInRange);
      wavesurfer.current.seekTo(currentTimeInRange / duration);
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer.current) {
      const newTime = wavesurfer.current.getCurrentTime() + 5;
      const currentTimeInRange = Math.min(newTime, duration);
      setCurrentTime(currentTimeInRange);
      wavesurfer.current.seekTo(currentTimeInRange / duration);
    }
  };

  function formatTime(seconds) {
    seconds = Math.floor(seconds); // truncate to nearest second
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5); // MM:SS
  }

  return (
    <div style={{ width: "900px" }}>
      <div id="waveform" ref={waveformRef} />
      <p className="flex justify-center text-l pt-7">{`${formatTime(
        currentTime
      )} / ${formatTime(duration)}`}</p>
      <div className="flex justify-center">
        <div
          style={{
            width: "900px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="controls"
        >
          <div
            className="pt-5"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "300px",
            }}
          >
            <Button
              className="rounded-full text-4xl size-30"
              onClick={handleSkipBack}
            >
              <FastRewindIcon fontSize="large" />
            </Button>
            <Button
              className="rounded-full text-4xl size-30"
              onClick={handlePlayPause}
            >
              {playing ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </Button>
            <Button
              className="rounded-full text-4xl size-30"
              onClick={handleSkipForward}
            >
              <FastForwardIcon fontSize="large" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

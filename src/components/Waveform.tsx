import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/base";
import { PlayArrow, Pause, FastRewind, FastForward } from "@mui/icons-material";
import WaveSurfer from "wavesurfer.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover";

interface WaveformProps {
  url: string;
  waveform: number[];
  duration: number;
  volume: number;
}

export default function Waveform({
  url,
  waveform,
  duration,
  volume,
}: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#eee",
      progressColor: "#EC4899",
      cursorColor: "#EC4899",
      barWidth: 3,
      barRadius: 10,
      height: 100,
      normalize: true,
      backend: "MediaElement",
      dragToSeek: true,
      url,
      peaks: [waveform.slice()],
      duration,
      plugins: [
        HoverPlugin.create({
          lineColor: "#EC4899",
          lineWidth: 2,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });

    wavesurfer.current = ws;
    ws.setVolume(volume);

    const unsubscribers = [
      ws.on("play", () => setPlaying(true)),
      ws.on("pause", () => setPlaying(false)),
      ws.on("timeupdate", (time) => setCurrentTime(time)),
      ws.on("finish", () => {
        ws.seekTo(0);
        setCurrentTime(0);
      }),
      ws.on("error", (error) => {
        console.error("WaveSurfer error:", error);
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
      ws.destroy();
      wavesurfer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, waveform]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };

  const handleSkipBack = () => {
    if (wavesurfer.current) {
      const newTime = Math.max(0, wavesurfer.current.getCurrentTime() - 5);
      wavesurfer.current.setTime(newTime);
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer.current) {
      const newTime = Math.min(
        wavesurfer.current.getCurrentTime() + 5,
        duration
      );
      wavesurfer.current.setTime(newTime);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "0") {
        event.preventDefault();
        handlePlayPause();
      } else if (event.key === "ArrowRight") {
        handleSkipForward();
      } else if (event.key === "ArrowLeft") {
        handleSkipBack();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line
  }, []);

  function formatTime(seconds: number): string {
    seconds = Math.floor(seconds);
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
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
              <FastRewind fontSize="large" />
            </Button>
            <Button
              className="rounded-full text-4xl size-30"
              onClick={handlePlayPause}
            >
              {playing ? (
                <Pause fontSize="large" />
              ) : (
                <PlayArrow fontSize="large" />
              )}
            </Button>
            <Button
              className="rounded-full text-4xl size-30"
              onClick={handleSkipForward}
            >
              <FastForward fontSize="large" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

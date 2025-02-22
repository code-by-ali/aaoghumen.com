import React, { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./CircularAudioPlayer.css";
import { PauseIcon, PlayIcon } from "lucide-react";

const CircularAudioPlayer = ({ audioUrl, color = "white" }) => {
  const playerRef = useRef(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Only attempt to auto-play on initial component mount
    if (initialLoadRef.current && audioUrl && playerRef.current) {
      initialLoadRef.current = false; // Mark initial load as complete

      const timeoutId = setTimeout(() => {
        playerRef.current.audio.current.play().catch((error) => {
          console.log("Auto-play failed:", error);
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [audioUrl]);

  return (
    <AudioPlayer
      ref={playerRef}
      src={audioUrl}
      showSkipControls={false}
      showJumpControls={false}
      layout="horizontal-reverse"
      customProgressBarSection={[]}
      customControlsSection={["MAIN_CONTROLS"]}
      customIcons={{
        play: <PlayIcon />,
        pause: <PauseIcon />,
      }}
      className={`circular-player ${color}`}
      style={{
        boxShadow: "none",
      }}
    />
  );
};

export default CircularAudioPlayer;

import React, { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // Default styles
import "./CircularAudioPlayer.css"; // Custom CSS for hiding elements
import { PauseIcon, PlayIcon } from "lucide-react";

const CircularAudioPlayer = ({ audioUrl, color = "white" }) => {
  return (
    <AudioPlayer
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

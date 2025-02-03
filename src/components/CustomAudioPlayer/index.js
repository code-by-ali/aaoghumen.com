import React from "react";
import { ReactComponent as PlayIcon } from "../../assets/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause-icon.svg";
import { ReactComponent as SpeakerIcon } from "../../assets/speaker-icon.svg";
import { ReactComponent as SpeakerMuteIcon } from "../../assets/speaker-mute-icon.svg";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const CustomAudioPlayer = ({ audioUrl }) => {
  return (
    <AudioPlayer
      src={audioUrl}
      showSkipControls={false}
      showJumpControls={false}
      layout="horizontal-reverse"
      customProgressBarSection={[
        "CURRENT_TIME",
        <div className="px-1 text-white">/</div>,
        "DURATION",
        <div className="px-2"></div>,
        "PROGRESS_BAR",
        "VOLUME_CONTROLS",
      ]}
      customControlsSection={["MAIN_CONTROLS"]}
      customIcons={{
        play: <PlayIcon className="w-[18px] h-[18px]" />,
        pause: <PauseIcon className="w-[18px] h-[18px]" />,
        volume: <SpeakerIcon className="w-[18px] h-[18px]" />,
        volumeMute: <SpeakerMuteIcon className="w-[18px] h-[18px]" />,
      }}
      className="custom-player"
      style={{
        boxShadow: "none",
      }}
    />
  );
};

export default CustomAudioPlayer;

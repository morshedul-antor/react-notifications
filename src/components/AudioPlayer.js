import React, { useRef, useEffect } from "react";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play();
    }
  }, [src]);

  return <audio ref={audioRef} controls={true} style={{ display: "none" }} />;
};

export default AudioPlayer;

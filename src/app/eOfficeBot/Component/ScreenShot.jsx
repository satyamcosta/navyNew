import { IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import CancelIcon from "@material-ui/icons/Cancel";

const ScreenShot = ({ screenShot, handleScreenShot, handleClose }) => {
  useEffect(() => {}, [screenShot, handleScreenShot]);

  const handleFullScreen = () => {
    let src = URL.createObjectURL(screenShot);
    window.open(src);
  };

  return (
    <div
      className={`${
        screenShot ? "show-screenShot" : "hide-screenShot"
      } ss-img-container`}
    >
      <IconButton onClick={handleClose}>
        <CancelIcon style={{ color: "#484747" }} />
      </IconButton>
      <img
        className="ss-img"
        src={screenShot ? URL.createObjectURL(screenShot) : ""}
        alt="ScreenShot"
        onClick={handleFullScreen}
        loading="lazy"
      />
    </div>
  );
};

export default ScreenShot;

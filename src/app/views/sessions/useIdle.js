import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

function useIdle({ onIdle, idleTime }) {
  const [isIdle, setIsIdle] = useState(false);

  //handles what happens when the user is idle
  const handleOnIdle = (event) => {
    if (!isIdle) {

      setIsIdle(true); //set the state to true
      const currentTime = new Date();
      const formattedCurrentTime = currentTime.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });

      onIdle(); //then call onIdle function
    }
  };

  //   console.log("IDLE IS",isIdle)

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * idleTime,
    onIdle: handleOnIdle,
    debounce: 500,
  });
  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle,
    setIsIdle,
  };
}

export default useIdle;

const { useState, useEffect, useRef } = React;

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft < 0) {
      const beep = document.getElementById("beep");
      if (beep) {
        beep.currentTime = 0;
        beep.play();
      }

      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  const handleBreakDecrement = () => {
    if (isRunning) return;
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (isRunning) return;
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (isRunning) return;
    if (sessionLength > 1) {
      const newValue = sessionLength - 1;
      setSessionLength(newValue);
      if (timerLabel === "Session") {
        setTimeLeft(newValue * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (isRunning) return;
    if (sessionLength < 60) {
      const newValue = sessionLength + 1;
      setSessionLength(newValue);
      if (timerLabel === "Session") {
        setTimeLeft(newValue * 60);
      }
    }
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    clearTimer();
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setIsRunning(false);

    const beep = document.getElementById("beep");
    if (beep) {
      beep.pause();
      beep.currentTime = 0;
    }
  };

  const warningClass = timeLeft < 60 ? "warning" : "";

  return (
    <div className="clock-container">
      <div className="title">25 + 5 Clock</div>

      <div className="length-controls">
        <div className="control-box">
          <div id="break-label" className="label">Break Length</div>
          <div className="control-row">
            <button
              id="break-decrement"
              className="control-btn"
              onClick={handleBreakDecrement}
            >
              ▼
            </button>
            <div id="break-length">{breakLength}</div>
            <button
              id="break-increment"
              className="control-btn"
              onClick={handleBreakIncrement}
            >
              ▲
            </button>
          </div>
        </div>

        <div className="control-box">
          <div id="session-label" className="label">Session Length</div>
          <div className="control-row">
            <button
              id="session-decrement"
              className="control-btn"
              onClick={handleSessionDecrement}
            >
              ▼
            </button>
            <div id="session-length">{sessionLength}</div>
            <button
              id="session-increment"
              className="control-btn"
              onClick={handleSessionIncrement}
            >
              ▲
            </button>
          </div>
        </div>
      </div>

      <div className={`timer-box ${warningClass}`}>
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className="main-controls">
        <button id="start_stop" className="main-btn" onClick={handleStartStop}>
          Start / Stop
        </button>
        <button id="reset" className="main-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

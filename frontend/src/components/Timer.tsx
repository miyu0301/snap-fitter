import React, { useState, useEffect } from 'react';

interface TimerProps {
  onEnd: (timeElapsed: number) => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ onEnd, isPaused }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prevTimeElapsed => prevTimeElapsed + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handlePauseClick = () => {
    setIsActive(prevIsActive => !prevIsActive);
    if (!isPaused) {
      setPausedTime(timeElapsed);
    }
  };

  const handleEndClick = () => {
    const currentTimeElapsed = isPaused ? pausedTime : timeElapsed;
    setIsActive(false);
    onEnd(currentTimeElapsed);
  };

  // Función para formatear el tiempo en HH:MM:SS
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="text-center m-auto">
        <div className="timer">{formatTime(timeElapsed)}</div>
        <button className='button btn-solid mt-4' onClick={handlePauseClick}>{isActive ? 'Pause' : 'Resume'}</button>
        <br></br>
        <button className='button btn-solid mt-4' onClick={handleEndClick}>End Workout</button>
      </div>
    </>
  );
};

export default Timer;

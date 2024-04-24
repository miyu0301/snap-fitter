import React, { useState, useEffect } from 'react';
import { FaRegPauseCircle } from 'react-icons/fa';
import { GrResume } from 'react-icons/gr';
import { IoIosPause } from 'react-icons/io';


interface TimerProps {
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ onPause, onResume, onEnd }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && !isPaused) {
      intervalId = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isActive, isPaused]);

  const handlePause = () => {
    setIsPaused(true);
    onPause();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume();
  };

  const handleEnd = () => {
    setIsActive(false);
    onEnd()
  }

  return (
    <div className="text-center m-auto relative">
      
      <div className="timer relative">
      
      <div className={`spinner ${isActive && !isPaused ? 'active' : ''}`}></div>
        {formatTime(timeElapsed)}
      </div>
      
      {isPaused ? (
        <button className="button btn-solid mt-4" onClick={handleResume}>
          <GrResume /> Resume
        </button>
      ) : (
        <button className="button btn-solid mt-4" onClick={handlePause}>
          <FaRegPauseCircle /> Pause
        </button>
      )}
      <br />
      <button className="button btn-solid mt-4" onClick={handleEnd}>
        End Workout
      </button>
    </div>
  );
};

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default Timer;

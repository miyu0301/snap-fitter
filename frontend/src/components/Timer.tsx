import React, { useState, useEffect } from 'react';

interface TimerProps {
  onEnd: (timeElapsed: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onEnd }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const handleEndClick = () => {
    const currentTimeElapsed = timeElapsed; // Almacenar el tiempo transcurrido actual
    setIsActive(false);
    onEnd(currentTimeElapsed); // Pasar el tiempo transcurrido almacenado
  };

  // Función para formatear el tiempo a formato HH:MM:SS
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
        <button className='button btn-solid mt-4' onClick={handleEndClick}>End Workout</button>
      </div>
    </>
  );
};

export default Timer;

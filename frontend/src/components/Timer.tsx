import React, { useState } from 'react';

const Timer = ({ onEnd }) => {
  const [showMainComponent, setShowMainComponent] = useState(true);


  return (
    <>
      {showMainComponent ? (
        <div>
          <h2>Timer Component</h2>
          {/* Aquí va el contenido del temporizador */}
          <button onClick={onEnd}>End</button>
        </div>
      ) : null}
    </>
  );
};

export default Timer;

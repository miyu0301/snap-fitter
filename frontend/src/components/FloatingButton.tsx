import { useState } from 'react';
import './../assets/css/FloatingButton.css';

const FloatingButton = () => {

const [showOptions, setShowOptions] = useState(false);

const toggleOptions = () => {
setShowOptions(!showOptions);
};

const handleChatClick = () => {
console.log('Chat clicked');
};

const handleWorkoutClick = () => {
console.log('Workout clicked');
};

  return (
    <div className="floating-button-container">
      <div className={`floating-button ${showOptions ? 'active' : ''}`} onClick={toggleOptions}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {showOptions && (
        <div className="options">
          <button onClick={handleChatClick}>Chat</button>
          <button onClick={handleWorkoutClick}>Workout</button>
        </div>
      )}
    </div>
  )
}

export default FloatingButton

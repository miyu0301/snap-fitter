import { useState } from 'react';
import './../assets/css/FloatingButton.css';
import { AiOutlineBars, AiOutlineClose } from 'react-icons/ai';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaRunning } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'

const FloatingButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleChatClick = () => {
    navigate('/chat');
    console.log('Chat clicked');
  };

  const handleWorkoutClick = () => {
    navigate('/record-workout');
    console.log('Workout clicked');
  };

  return (
    <div className="floating-button-container">
      <div className={`floating-button ${showOptions ? 'active' : ''}`} onClick={toggleOptions}>
        {showOptions ? <AiOutlineClose /> : <AiOutlineBars />}
      </div>
      {showOptions && (
        <div className="options">
          <button className="floating-options-button floating-chat-button" onClick={handleChatClick}> <IoChatbubbleEllipsesSharp size="1.5rem" /> </button>
          <button className="floating-options-button floating-workout-button" onClick={handleWorkoutClick}><FaRunning size="1.5rem" /></button>
        </div>
      )}
    </div>
  )
}

export default FloatingButton;

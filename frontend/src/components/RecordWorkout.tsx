import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import UserNavbar from '../partials/navbar';
import Timer from './Timer';
import FloatingButton from './FloatingButton';

const RecordWorkout: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showWorkoutTime, setShowWorkoutTime] = useState(false);

  const handleStartClick = () => {
    setShowTimer(true);
  };

  const handleEndClick = (timeElapsed: number) => {
    setShowTimer(false);
    setWorkoutTime(timeElapsed);
    setShowWorkoutTime(true);
  };

  return (
    <>
      <UserNavbar />
      <div className='d-flex align-items-center justify-items-center'>
        <div className='home-bg-image bg-cover-center col-50'></div>
        <div className='col-50'>
          <div className="container text-container vertical-center-form">
            {!showTimer && !showWorkoutTime ? (
              <div>
                <h2 className='anton-regular txt-md mb-4 text-center'>Record workout</h2>
                <p>Select workout:</p>
                <Form.Select aria-label="Default select example">
                  <option>Select type of activity</option>
                  <option value="1">Outdoor Walk</option>
                  <option value="2">Core Training</option>
                  <option value="3">Elliptical</option>
                  <option value="4">Indoor Run</option>
                  <option value="5">Outdoor Run</option>
                  <option value="6">Outdoor Cycle</option>
                  <option value="7">Hiking</option>
                  <option value="8">Yoga</option>
                  <option value="9">Open Water Swim</option>
                </Form.Select>
                <div className="text-right">
                  <button className='button btn-solid w-50 mt-4' onClick={handleStartClick}>Start</button>
                </div>
              </div>
            ) : null}
            {showTimer && !showWorkoutTime && <Timer onEnd={handleEndClick} />}
            {showWorkoutTime && 
            <p>Total workout time: {workoutTime} seconds <br></br>Calories burned: ???</p>}
          </div>
        </div>
        <FloatingButton />
      </div>
    </>
  );
};

export default RecordWorkout;

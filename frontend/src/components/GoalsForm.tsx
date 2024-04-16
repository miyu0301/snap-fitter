import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUser } from '../user/userProvider';

const GoalForm = () => {
  const { user, updateUser } = useUser();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleOptionClick = (goal: SetStateAction<string>) => {
    setSelectedGoal(goal);
  };

  const handleNextClick = () => {
    if (!selectedGoal) {
      setError('Please select a goal.');
    } else {
      updateUser({ goal_id: parseInt(selectedGoal) });
      navigate('/your-level');
      setError('');
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className='col-50'>
        <div className="container text-container vertical-center-form">
          <h2 className='anton-regular txt-md text-center mb-4'>What is your goal?</h2>
          {error && <span className="alert alert-danger error-msg">{error}</span>}

          <Button className={`button btn-select-option mb-4 w-100 ${selectedGoal === '1' ? 'active' : ''}`} onClick={() => handleOptionClick('1')}>Gain Muscle</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedGoal === '2' ? 'active' : ''}`} onClick={() => handleOptionClick('2')}>Gain weight</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedGoal === '3' ? 'active' : ''}`} onClick={() => handleOptionClick('3')}>Lose weight</Button>

          <Button className="btn-solid button bg-dark text-white w-100" onClick={handleNextClick}>Next</Button>
        </div>
      </div>

      <div className='home-bg-image bg-cover-center col-50'></div>
    </div>
  );
}

export default GoalForm;

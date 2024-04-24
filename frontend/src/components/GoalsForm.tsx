import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUser } from '../user/userProvider';
import { MdOutlineNavigateNext } from 'react-icons/md';
import logo from '../assets/images/logo_v1.png';

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
    <div className='d-flex align-items-center justify-content-center columns m-column-reverse'>
      <div className='col-50'>
        <div className="container home-text-container vertical-center-form">
          <div className='text-center'>
            <img src={logo} width={250} alt='Logo of the SnapFitter' />
          </div>
          <p className='anton-regular txt-md text-center mb-2 mt-4'>What is your goal?</p>
          {error && <span className="alert alert-danger error-msg text-center">{error}</span>}
          <Button className={`button btn-select-option mb-4 mt-4 w-100 ${selectedGoal === '1' ? 'active' : ''}`} onClick={() => handleOptionClick('1')}>Gain Muscle</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedGoal === '2' ? 'active' : ''}`} onClick={() => handleOptionClick('2')}>Gain weight</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedGoal === '3' ? 'active' : ''}`} onClick={() => handleOptionClick('3')}>Lose weight</Button>
          <Button className="btn-solid button bg-dark text-white w-100" onClick={handleNextClick}>Next<MdOutlineNavigateNext /></Button>
        </div>
      </div>
      <div className='goal-bg-image bg-cover-center col-50 bg-image-left-border relative'>
      <div className="div-image-border-radius"></div>
      </div>
    </div>
  );
}

export default GoalForm;

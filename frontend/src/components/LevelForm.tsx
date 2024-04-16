import { SetStateAction, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUser } from '../user/userProvider';

const LevelForm = () => {
  const { user, updateUser } = useUser();

  const [selectedLevel, setSelectedLevel] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleOptionClick = (level: SetStateAction<string>) => {
    setSelectedLevel(level);
  };


  const handleNextClick = () => {
    if (!selectedLevel) {
      setError('Please select a goal.');
    } else {
      updateUser({ level_id: parseInt(selectedLevel) });
      navigate('/generales');
      setError('');
    }

    console.log({user})
  };  

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className='col-50'>
        <div className="container text-container vertical-center-form">
          <h2 className='anton-regular txt-md text-center mb-4'>Select your level</h2>

          {error && <span className="alert alert-danger error-msg">{error}</span>}

          <Button className={`button btn-select-option mb-4 w-100 ${selectedLevel === '1' ? 'active' : ''}`} onClick={() => handleOptionClick('1')}>Begginer</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedLevel === '2' ? 'active' : ''}`} onClick={() => handleOptionClick('2')}>Intermediate</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedLevel === '3' ? 'active' : ''}`} onClick={() => handleOptionClick('3')}>Advanced</Button>

          <Button className="btn-solid button bg-dark text-white w-100" onClick={handleNextClick}>Next</Button>

          <Link to="/your-goal" className="link mt-4 text-center">Back</Link>
        </div>
      </div>

      <div className='home-bg-image bg-cover-center col-50'></div>
    </div>
  );
}

export default LevelForm;

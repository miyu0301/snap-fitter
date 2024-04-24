import { SetStateAction, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUser } from '../user/userProvider';
import { MdOutlineNavigateNext } from 'react-icons/md';
import logo from '../assets/images/logo_v1.png';
import { GoArrowLeft } from 'react-icons/go';

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
      setError('Please select your level.');
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
    <div className='d-flex align-items-center justify-content-center columns m-column-reverse'>
      <div className='col-50'>
      <div className="container home-text-container vertical-center-form">
          <div className='text-center'>
            <img src={logo} width={250} alt='Logo of the app' />
          </div>
          <p className='anton-regular txt-md text-center mb-2 mt-4'>Select your level</p>

          {error && <span className="alert alert-danger error-msg text-center">{error}</span>}

          <Button className={`button btn-select-option mb-4 mt-4 w-100 ${selectedLevel === '1' ? 'active' : ''}`} onClick={() => handleOptionClick('1')}>Begginer</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedLevel === '2' ? 'active' : ''}`} onClick={() => handleOptionClick('2')}>Intermediate</Button>
          <Button className={`button btn-select-option mb-4 w-100 ${selectedLevel === '3' ? 'active' : ''}`} onClick={() => handleOptionClick('3')}>Advanced</Button>

          <Button className="btn-solid button bg-dark text-white w-100" onClick={handleNextClick}>Next<MdOutlineNavigateNext /></Button>

          <Link to="/your-goal" className="link mt-4 text-center small"><GoArrowLeft />Back</Link>
        </div>
      </div>

      <div className='level-bg-image bg-cover-center col-50 bg-image-left-border relative'>
      <div className="div-image-border-radius"></div>
      </div>
    </div>
  );
}

export default LevelForm;

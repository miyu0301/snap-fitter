import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useUser } from '../user/userProvider';
import { useAuth } from '../auth/AuthProvider';

const UserPropertiesForm = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, updateUser,  validateUserObject, handleDBUpdate} = useUser();
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    gender: '',
    birthday: '',
    height: '',
    weight: ''
  });

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const handleBirthdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirthday(event.target.value);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(event.target.value);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };

  const handleNextClick = () => {
    let formValid = true;
    const newErrors = { ...errors };

    if (!gender) {
      newErrors.gender = 'Please select a gender.';
      formValid = false;
    } else {
      newErrors.gender = '';
    }

    if (!birthday) {
      newErrors.birthday = 'Please select a birthday.';
      formValid = false;
    } else {
      newErrors.birthday = '';
    }

    if (!height || isNaN(Number(height))) {
      newErrors.height = 'Please enter a valid height.';
      formValid = false;
    } else {
      newErrors.height = '';
    }

    if (!weight || isNaN(Number(weight))) {
      newErrors.weight = 'Please enter a valid weight.';
      formValid = false;
    } else {
      newErrors.weight = '';
    }

    if (formValid) {
      // send the data to updateUser
      console.log('Gender:', gender);
      console.log('Birthday:', birthday);
      console.log('Height:', height);
      console.log('Weight:', weight);
      const userBack = { ...user, gender: parseInt(gender), birthday:birthday, height:parseInt(height), weight:parseInt(weight) };
      updateUser({ gender: parseInt(gender), birthday:birthday, height:parseInt(height), weight:parseInt(weight) });
      const validateObject = validateUserObject(userBack)

      console.log({validateObject})

      if(validateObject){
        const updateDBUser = handleDBUpdate(userBack)
        console.log(updateDBUser)
        auth.completedInfo()
        navigate('/welcome');

      }else{
        console.log("Complete your profile correctly")
        navigate('/your-goal');
      }
      
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className='d-flex align-items-center justify-items-center'>
      <div className='col-50'>
        <div className="container text-container vertical-center-form">
          <Form>
            <h2 className='anton-regular txt-md mb-4'>Gender</h2>
            <div className="mb-3">
              <Form.Check
                inline
                label="Female"
                name="gender"
                type="radio"
                value="1"
                onChange={handleGenderChange}
              />
              <Form.Check
                inline
                label="Male"
                name="gender"
                type="radio"
                value="2"
                onChange={handleGenderChange}
              />
              <Form.Check
                inline
                label="Other"
                name="gender"
                type="radio"
                value="3"
                onChange={handleGenderChange}
              />
            </div>

            {errors.gender && <p className="error-msg alert alert-danger small">{errors.gender}</p>}

            <h2 className='anton-regular txt-md'>Birthday</h2>
            <input
              type="date"
              className="date-input w-100 mb-4"
              value={birthday}
              onChange={handleBirthdayChange}
            />

            {errors.birthday && <p className="error-msg alert alert-danger small">{errors.birthday}</p>}

            <div className='d-flex gap-3'>
              <div className="input-height w-50">
                <h2 className='anton-regular txt-md'>Height</h2>
                <input
                  type="text"
                  className="date-input w-100"
                  value={height}
                  onChange={handleHeightChange}
                  placeholder="cm"
                />

                {errors.height && <p className="error-msg alert alert-danger small">{errors.height}</p>}
              </div>

              <div className="input-height w-50">
                <h2 className='anton-regular txt-md'>Weight</h2>
                <input
                  type="text"
                  className="date-input w-100"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="lib"
                />

                {errors.weight && <p className="error-msg alert alert-danger small">{errors.weight}</p>}
              </div>
            </div>
          </Form>

          <Button className="btn-solid button bg-dark text-white w-100 mt-4" onClick={handleNextClick}>Next</Button>

          <Link to="/your-level" className="link mt-4 text-center">Back</Link>
        </div>
      </div>

      <div className='home-bg-image bg-cover-center col-50'></div>
    </div>
  );
}

export default UserPropertiesForm;

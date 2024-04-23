import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../partials/navbar';
import { useUser } from '../user/userProvider';
import { useAuth } from '../auth/AuthProvider';
import { Button } from 'react-bootstrap';
import { FaRunning, FaUserCircle, FaMale, FaFemale, FaWeight, FaEnvelope, FaRuler, FaBirthdayCake } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import FloatingButton from './FloatingButton';
import profileImage from '../assets/images/profile_placeholder.jpg';

const Profile = () => {
  const user = useUser();
  const [dbUser, setDbUser] = useState({
    id: 0,
    username: '',
    email: '',
    goal_id: 0,
    level_id: 0,
    gender: 0,
    birthday: '',
    height: '',
    weight: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State to store the selected image
  const [selectedGender, setSelectedGender] = useState<number | null>(null);
  const auth = useAuth();
  const sessionID: any = auth.getSessionId();

  useEffect(() => {
    const fetchData = async () => {
      if (sessionID) {
        try {
          const userData: any = await user.fetchUserData(sessionID);
          setDbUser(userData);
          setSelectedGender(userData.gender);
          calculateAge(userData.birthday);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];
      setSelectedImage(image);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send image to server
      // await user.uploadProfileImage(selectedImage);
      await user.handleDBUpdate(dbUser);
      setFormSubmitted(true);
      setSuccessMessage('Your profile has been updated');
      calculateAge(dbUser.birthday); 
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleLogout = () => {
    auth.logout()
  };

  const handleGenderClick = (gender: number) => {
    setDbUser(prevState => ({
      ...prevState,
      gender: gender,
    }));
    setSelectedGender(gender);
  };

  return (
    <>
      <UserNavbar username={dbUser.username} />
      <div className='container mt-80'>
        <div className='row'>
          <div className='col-sm-12 col-md-3 border-right md-hide'>
            <h1 className='anton-regular uppercase'>User Profile</h1>     
            <Link className='profile-link profile-active-item' to="#"><FaUserCircle size="1.2em" /> Profile Info</Link>       
            <Link className="profile-link" to="/record-workout"><FaRunning size="1.5em" /> Record Workout</Link>
            <Link className="profile-link" to="/history"><BsGraphUp size="1.2em" /> History</Link>
            <Link className="profile-link" to="/chat"><IoChatbubbleEllipsesOutline size="1.5em" /> Chat</Link>
            <Button className="mt-4 mb-4 no-button" onClick={handleLogout}><RiLogoutCircleLine /> Logout</Button>
          </div>
          <div className='col-sm-12 col-md-9'>
            <div className="container">
              {formSubmitted && (
                <div className="alert alert-success text-center" role="alert">
                  {successMessage}
                </div>
              )}
              <div className="position-relative profile-image-container mb-4">
                <label htmlFor="imageInput">
                  <img src={profileImage} alt="Profile" className="img-fluid rounded-circle profileImage" style={{ width: '7em', height: '7em', cursor: 'pointer' }} />
                  <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} /> {/* Input oculto para seleccionar imagen */}
                </label>
                <p className='pb-0 mb-0'>{dbUser.username}</p>
                <p className='mb-4 small'>Age: {age}</p> 
                <div className="mb-3 col-sm-12 md-text-center">
                  <Button variant="" className={`button ${selectedGender === 1 ? 'btn-solid' : 'btn-outline'}`} onClick={() => handleGenderClick(1)}>
                    Male
                    <FaMale className="ms-1" />
                  </Button>
                  <Button variant="" className={`button ${selectedGender === 2 ? 'btn-solid' : 'btn-outline'} ms-2`} onClick={() => handleGenderClick(2)}>
                    Female
                    <FaFemale className="ms-1" />
                  </Button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="row">
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <input type="email" className="form-control" id="email" name="email" value={dbUser.email} onChange={handleChange} />
                    <span className="input-group-text"><FaEnvelope /></span>
                  </div>
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="birthday" className="form-label">Birthday</label>
                  <div className="input-group">
                    <input type="date" className="form-control" id="birthday" name="birthday" value={formatDate(dbUser.birthday)} onChange={handleChange} />
                    <span className="input-group-text"><FaBirthdayCake /></span> 
                  </div>
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="height" className="form-label">Height (cm)</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="height" name="height" value={dbUser.height} onChange={handleChange} />
                    <span className="input-group-text"><FaRuler /></span> 
                  </div>
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="weight" className="form-label">Weight (kg)</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="weight" name="weight" value={dbUser.weight} onChange={handleChange} />
                    <span className="input-group-text"><FaWeight /></span>
                  </div>
                </div>
                <div className="mb-3 col-md-12 text-center">
                  <button type="submit" className="button btn-solid mt-4 w-50">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <FloatingButton />
      </div>
    </>
  )
}

export default Profile;

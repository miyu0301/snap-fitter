import { Link } from 'react-router-dom';
import UserNavbar from '../partials/navbar';
import { useUser } from '../user/userProvider';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from 'react-bootstrap';
import { FaRunning } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";

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
  const auth = useAuth();
  const sessionID: any = auth.getSessionId();

  useEffect(() => {
    const fetchData = async () => {
      if (sessionID) {
        try {
          const userData: any = await user.fetchUserData(sessionID);
          setDbUser(userData); // Sets the user data once it has been obtained
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
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month; // Add zero if month is single digit
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day; // Add zero if day is single digit
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    user.handleDBUpdate(dbUser);
  };

  const handleLogout = () => {
    auth.logout()
  };

  return (
    <>
      <UserNavbar username={dbUser.username} />
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-4'>
            <h1 className='anton-regular uppercase'>User Profile</h1>            
            <Link className="profile-link" to="/record-workout"><FaRunning size="1.5em" /> Record Workout</Link>
            <Link className="profile-link" to="/history"><BsGraphUp size="1.2em" /> History</Link>
            <Link className="profile-link" to="/chat"><IoChatbubbleEllipsesOutline size="1.5em" /> Chat</Link>
            <Button onClick={handleLogout}><RiLogoutCircleLine /> Logout</Button>
            
          </div>
          <div className='col-sm-12 col-md-8'>
            

            <div className="container">
              <form onSubmit={handleSubmit} className="row">

              <div className="mb-3 col-sm-12">
              <Link className="button btn-outline" to="#">Male</Link>
              <Link className="button btn-solid" to="#">Female</Link>
              </div>

                <div className="mb-3 col-sm-12">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" readOnly disabled className="form-control" id="username" name="username" value={dbUser.username} onChange={handleChange} />
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" value={dbUser.email} onChange={handleChange} />
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="birthday" className="form-label">Birthday</label>
                  <input type="date" className="form-control" id="birthday" name="birthday" value={formatDate(dbUser.birthday)} onChange={handleChange} />
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="height" className="form-label">Height (cm)</label>
                  <input type="number" className="form-control" id="height" name="height" value={dbUser.height} onChange={handleChange} />
                </div>
                <div className="mb-3 col-sm-12 col-md-6">
                  <label htmlFor="weight" className="form-label">Weight (kg)</label>
                  <input type="number" className="form-control" id="weight" name="weight" value={dbUser.weight} onChange={handleChange} />
                </div>

                <div className="mb-3 col-md-6">
                <button type="submit" className="button btn-solid mt-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;

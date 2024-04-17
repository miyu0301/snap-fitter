import { Link } from 'react-router-dom';
import UserNavbar from '../partials/navbar';
import { useUser } from '../user/userProvider';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

const Welcome = () => {
  const user = useUser();
  const [dbUser, setDbUser] = useState(null);
  const auth = useAuth()
  const sessionID:any = auth.getSessionId()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData:any = await user.fetchUserData(sessionID);
        setDbUser(userData); // Sets the user data once it has been obtained
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []); 
  

  return (
    <>
      <UserNavbar username = {dbUser ? dbUser.username : ''} />
      <div className='d-flex align-items-center justify-items-center'>
        <div className='home-bg-image bg-cover-center col-50'></div>
        <div className='col-50'>
          <div className="container text-container vertical-center-form">
            <h2 className='anton-regular txt-md mb-4 text-center'>Welcome, {dbUser ? dbUser.username : ''}!</h2>

            <h2 className='anton-regular txt-md mb-4 text-center'>What do you want to do today?</h2>
            <Link to="/record-workout" className="button btn-select-option w-100 mb-4 text-left">Record Workout</Link>
            <Link to="/history" className="button btn-select-option w-100">History</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Welcome;

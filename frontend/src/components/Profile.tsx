import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';


const Profile = () => {
  return (
    
    <div className='d-flex align-items-center container'>
        
    <div className='col-left-profile'>

    <h1 className='anton-regular uppercase'>User Profile</h1>

    <Link className="profile-link" to="/profile">User Info</Link>

    <Link className="profile-link" to="/profile">Notifications</Link>

    <Link className="profile-link" to="/history">History</Link>

    </div>

    <div className='col-right-profile container'>
    <Link className="button btn-outline" to="/">Male</Link>
    <Link className="button btn-solid" to="/">Female</Link>
    </div>
  
  </div>
  )
}

export default Profile

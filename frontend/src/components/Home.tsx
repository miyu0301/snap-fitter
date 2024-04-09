import 'bootstrap/dist/css/bootstrap.min.css';
//import logo from '../assets/images/app_home_1.jpg';
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (

      <div className='d-flex align-items-center'>
        
        <div className='home-bg-image bg-cover col-left'>
            {/* <img src={logo} width="100%" /> */}
        </div>

        <div className='col-right'>
        <div className="container text-container">
        <p className='anton-regular uppercase mb-0'>Welcome to</p>
        <h1 className='anton-regular txt-lg'>Fitness App!</h1>
        <p>Your personalized calorie calculator and activity tracker in one place.</p>
        <p>Log your daily activities and let our app do the math for you.</p>
        <p className='mb-4'>Start taking care of yourself today!</p>
        
        <Link className="button btn-outline w-50" to="/sign-up">Sign Up</Link>
        <Link className="button btn-solid w-50" to="/sign-in">Sign in</Link>

        {/* <Link className="button" to="/profile">Profile</Link>
        <Link className="button" to="/history">History</Link> */}
        </div>
        </div>
      
      </div>

  )
}

export default Welcome

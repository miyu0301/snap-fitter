import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/images/logo_v1.png';
import { Link } from 'react-router-dom'

const Home = () => {
  return (

      <div className='columns d-flex align-items-center'>
        
        <div className='home-bg-image bg-cover col-left col-image relative'>
          <div className="div-image-border-radius"></div>
        </div>

        <div className='col-right'>
        <div className="container home-text-container">
        {/* <p className='anton-regular uppercase mb-0'>Welcome to</p> */}
        <h1 className='anton-regular txt-lg'><img src={logo} width={350} alt='Logo of the app' /></h1>
        <p>Your personalized calorie calculator and activity tracker in one place.</p>
        <p>Log your daily activities and let our app do the math for you.</p>
        <p className='mb-4'>Start taking care of yourself today!</p>
        
        <Link className="button btn-outline w-50 br-l" to="/sign-up">Sign Up</Link>
        <Link className="button btn-solid w-50 br-r" to="/sign-in">Sign in</Link>

        {/* <Link className="button" to="/profile">Profile</Link>
        <Link className="button" to="/history">History</Link> */}
        </div>
        </div>
      
      </div>

  )
}

export default Home

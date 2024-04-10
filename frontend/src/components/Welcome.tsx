import { Link } from 'react-router-dom'
import {Button, Form} from 'react-bootstrap';
import UserNavbar from '../partials/navbar';

const Welcome = () => {
  return (
    <>
    <UserNavbar />
    <div className='d-flex align-items-center justify-items-center'>
          <div className='home-bg-image bg-cover-center col-50'></div>
          <div className='col-50'>
              <div className="container text-container vertical-center-form">
                
                  <h2 className='anton-regular txt-md mb-4 text-center'>Welcome!</h2>

                  <h2 className='anton-regular txt-md mb-4 text-center'>What do you want to do today?</h2>
                  <Link to="/record-workout" className="button btn-select-option w-100 mb-4 text-left">Record Workout</Link>
                  <Link to="/history" className="button btn-select-option w-100">History</Link>
              </div>
          </div>
      </div>
      </>
  )
}

export default Welcome

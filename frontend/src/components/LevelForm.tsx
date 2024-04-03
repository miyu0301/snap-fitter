import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';



const LevelForm = () => {
 
  return (
    <div className='d-flex align-items-center justify-items-center'>
        
    <div className='col-50'>
    <div className="container text-container vertical-center-form">

    <h2 className='anton-regular txt-md text-center mb-4'>Select your level?</h2>

    
    <Button className="button btn-select-option mb-4 w-100">Beginner</Button>
    <Button className="button btn-select-option mb-4 w-100">Intermediate</Button>
    <Button className="button btn-select-option mb-4 w-100">Advanced</Button>

    <Link to="/generales" className="btn-solid button bg-dark text-white w-100">Next</Link>

    <Link to="/your-goals" className="link mt-4 text-center">Back</Link>


    {/* <Link className="button" to="/profile">Profile</Link>
    <Link className="button" to="/history">History</Link> */}
    </div>
    </div>

    <div className='home-bg-image bg-cover-center col-50'>

    </div>
  
  </div>
  )
}

export default LevelForm

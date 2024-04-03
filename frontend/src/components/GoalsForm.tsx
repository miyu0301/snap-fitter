import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';



const GoalsForm = () => {
 
  return (
    <div className='d-flex align-items-center justify-items-center'>
        
    <div className='col-50'>
    <div className="container text-container vertical-center-form">

    <h2 className='anton-regular txt-md text-center mb-4'>What is your goal?</h2>

    
    <Button className="button btn-select-option mb-4 w-100">Gain Muscle</Button>
    <Button className="button btn-select-option mb-4 w-100">Gain weight</Button>
    <Button className="button btn-select-option mb-4 w-100">Lose weight</Button>
    <Button className="button btn-select-option mb-4 w-100">Lose weight</Button>

    <Link to="/your-level" className="btn-solid button bg-dark text-white w-100">Next</Link>


    {/* <Link className="button" to="/profile">Profile</Link>
    <Link className="button" to="/history">History</Link> */}
    </div>
    </div>

    <div className='home-bg-image bg-cover-center col-50'>

    </div>
  
  </div>
  )
}

export default GoalsForm

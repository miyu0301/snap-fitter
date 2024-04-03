import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';

const UserPropertiesForm = () => {
 
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
            name="group1"
            type= "radio"
          />
          <Form.Check
            inline
            label="Male"
            name="group1"
            type= "radio"
          />
        </div>

    <h2 className='anton-regular txt-md'>Birthday</h2>
    <input type="date" className="date-input w-100 mb-4" placeholder="dd/mm/yyyy" />

    <div className='d-flex gap-3'>
    <div className="input-height w-50">
    <h2 className='anton-regular txt-md'>Height</h2>
    <input type="text" className="date-input w-100 mb-4" placeholder="cm" />
    </div>

    <div className="input-height w-50">
    <h2 className='anton-regular txt-md'>Weight</h2>
    <input type="text" className="date-input w-100" placeholder="lib" />
    </div>
    </div>
    </Form>

    <Link to="/welcome" className="btn-solid button bg-dark text-white w-100">Next</Link>

    <Link to="/generales" className="link mt-4 text-center">Back</Link>


    </div>
    </div>

    <div className='home-bg-image bg-cover-center col-50'>

    </div>
  
  </div>
  )
}

export default UserPropertiesForm

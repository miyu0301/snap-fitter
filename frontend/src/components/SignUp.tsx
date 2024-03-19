import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';


const SignUp = () => {
  return (
    
    <div className='d-flex align-items-center'>
        
    <div className='home-bg-image bg-cover col-left'>
        {/* <img src={logo} width="100%" /> */}
    </div>

    <div className='col-right'>
    <div className="container text-container">
    <h1 className='anton-regular txt-lg uppercase text-center'>Sign Up</h1>
    
    <Form>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Joe Doe" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="joe@mail.com" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="******" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="******" />
      </Form.Group>      

      <Button variant="outline-dark button w-100 mt-4">Sign Up</Button>
    </Form>

    <p className="txt-sm mt-4 text-center">Do you have an account? <Link to="/sign-in">Sign in here</Link></p>

    </div>
    </div>
  
  </div>
  )
}

export default SignUp

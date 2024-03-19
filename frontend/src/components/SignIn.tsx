import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';


const SignIn = () => {
  return (
    
    <div className='d-flex align-items-center'>
        
    <div className='home-bg-image bg-cover col-left'>
        {/* <img src={logo} width="100%" /> */}
    </div>

    <div className='col-right'>
    <div className="container text-container">
    <h1 className='anton-regular txt-lg uppercase text-center'>Sign In</h1>
    
    <Form>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Joe Doe" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="******" />
      </Form.Group>
      <p className="txt-sm">Forgot your password?</p>
    
      <Link className="button btn-solid w-100 text-center" to="/profile">Enter</Link>
      {/* <Button variant="outline-dark button w-100">Enter</Button> */}
    </Form>

    <Button variant="outline-dark w-100 mt-4">Continue with Google</Button>

    <Button variant="outline-dark w-100 mt-4">Continue with Facebook</Button>

    <p className="txt-sm mt-4 text-center">Don’t have an account? <Link to="/sign-up">Sign up here</Link></p>

    </div>
    </div>
  
  </div>
  )
}

export default SignIn

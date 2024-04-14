import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap';
import { useState } from 'react';
import DefaultLayout from '../partials/DefaultLayout';

interface FormData {
  name: string;
  email: string;
}

const SignIn = () => {

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Data sent successfully');
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };  

  return (
    <DefaultLayout>
    <div className='d-flex align-items-center'>
        
    <div className='home-bg-image bg-cover col-left'>
        {/* <img src={logo} width="100%" /> */}
    </div>

    <div className='col-right'>
    <div className="container text-container">
    <h1 className='anton-regular txt-lg uppercase text-center'>Sign In</h1>
    
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange} placeholder="Joe Doe" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="******" autoComplete="password" />
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
  </DefaultLayout>
  )
}

export default SignIn

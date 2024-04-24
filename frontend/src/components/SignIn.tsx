import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import DefaultLayout from '../partials/DefaultLayout';
import Cookies from 'js-cookie';
import { useAuth } from '../auth/AuthProvider';
import logo from '../assets/images/logo_v1.png';
import { FaHome, FaRegUser } from "react-icons/fa";
import { BsLockFill, BsPersonFill } from 'react-icons/bs';
import { RiLockPasswordLine } from 'react-icons/ri';
import { BiHome } from 'react-icons/bi';

interface FormData {
  username: string;
  password: string;
}

const SignIn = () => {

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear the error message when the user starts typing again
    setErrors({
      ...errors,
      [name]: ''
    });
  };  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors: {[key: string]: string} = {};

    // Validation: Check if name and password are not empty
    if (!formData.username) {
      validationErrors['username'] = 'Username is required';
    }
    if (!formData.password) {
      validationErrors['password'] = 'Password is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENV}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Data sent successfully:', data);
        
        if (data.is_loginned === true) {
          Cookies.set('sessionId', data.user_id);
          auth.authenticatedUser();
          navigate('/welcome');
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            general: 'No account found with the provided credentials'
          }));
        }
      } else {
        console.error('Failed to send data');
        setErrors({general: 'An error occurred. Please try again later.'}); // Set general error message
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({general: 'An error occurred. Please try again later.'}); // Set general error message
    }
  };  

  return (
    <DefaultLayout>
      <div className='d-flex align-items-center columns'>
      <div className='signin-bg-image bg-image-border bg-cover col-image col-left relative'>
      <div className="div-image-border-radius"></div>
      </div>
        <div className='col-right'>
          <div className="container home-text-container">
          <div className='text-center'>
            <Link to="/"><img src={logo} width={250} alt='Logo of the app' /></Link>
          </div>
          <p className='txt-ms text-center anton-regular mt-2'>Login</p>
            {errors['general'] && <div className="alert alert-danger small text-center">{errors['general']}</div>} {/* Display general error message */}
            <Form className='form-w' onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <InputGroup className={errors.username ? 'is-invalid' : ''}>
                <Form.Control 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange} 
                  placeholder="Joe Doe"
                />
                <InputGroup.Text>
                <FaRegUser />
                </InputGroup.Text>
                </InputGroup>
                {errors['username'] && <Form.Text className="text-danger">{errors['username']}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup className={errors.password ? 'is-invalid' : ''}>
                <Form.Control 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange} 
                  placeholder="******" 
                  autoComplete="password"                  
                />
                <InputGroup.Text>
                <RiLockPasswordLine />
                </InputGroup.Text>
                </InputGroup>
                {errors['password'] && <Form.Text className="text-danger">{errors['password']}</Form.Text>}                
              </Form.Group>


              {/* <p className="txt-sm">Forgot your password?</p> */}
              <Button type="submit" className="button outline-button w-100 text-center">Enter</Button>
            </Form>
            {/* <Button variant="outline-dark w-100 mt-4">Continue with Google</Button>
            <Button variant="outline-dark w-100 mt-4">Continue with Facebook</Button> */}
            <p className="txt-sm mt-4 text-center">Don't have an account?<br></br><Link to="/sign-up">Sign up here</Link></p>
            <p className="txt-sm mt-4 text-center"><Link to="/">
              <BiHome className="text-dark" size="1.8em" /></Link>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default SignIn;

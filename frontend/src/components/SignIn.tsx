import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import DefaultLayout from '../partials/DefaultLayout';
import Cookies from 'js-cookie';
import { useAuth } from '../auth/AuthProvider';

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
      const response = await fetch('http://localhost:3000/login', {
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
      <div className='d-flex align-items-center'>
        <div className='home-bg-image bg-cover col-left'>
            {/* <img src={logo} width="100%" /> */}
        </div>
        <div className='col-right'>
          <div className="container text-container">
            <h1 className='anton-regular txt-lg uppercase text-center'>Sign In</h1>
            {errors['general'] && <div className="alert alert-danger small text-center">{errors['general']}</div>} {/* Display general error message */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange} 
                  placeholder="Joe Doe"
                  className={errors['username'] ? 'is-invalid' : ''}
                />
                {errors['username'] && <Form.Text className="text-danger">{errors['username']}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange} 
                  placeholder="******" 
                  autoComplete="password"
                  className={errors['password'] ? 'is-invalid' : ''}
                />
                {errors['password'] && <Form.Text className="text-danger">{errors['password']}</Form.Text>}
              </Form.Group>
              <p className="txt-sm">Forgot your password?</p>
              <Button type="submit" className="button btn-solid w-100 text-center">Enter</Button>
            </Form>
            <Button variant="outline-dark w-100 mt-4">Continue with Google</Button>
            <Button variant="outline-dark w-100 mt-4">Continue with Facebook</Button>
            <p className="txt-sm mt-4 text-center">Don't have an account? <Link to="/sign-up">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default SignIn;

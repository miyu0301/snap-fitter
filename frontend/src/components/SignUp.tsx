import React, { useEffect, useState } from 'react';
//import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import DefaultLayout from '../partials/DefaultLayout';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/AuthConstants';
import Cookies from 'js-cookie';


interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error message and border when user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear errors before each validation

    // Validate all fields are filled
    const newErrors: Partial<FormData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key as keyof FormData] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Validate email format
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(formData.email)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'Please enter a valid email address.'
      }));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Data sent successfully:', data);

        if (data.isNewUser === true) {
          Cookies.set('sessionId', data.user_id);
          auth.authenticatedUser();
          navigate('/your-goal');
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            username: 'A user with this username already exists. Please choose another one.'
          }));
        }
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

useEffect(() => {
if (auth.isAuthenticated) {
navigate('/your-goal');
}
}, [auth.isAuthenticated, navigate]);

  return (
    <DefaultLayout>
    <div className='d-flex align-items-center'>
      <div className='home-bg-image bg-cover col-left'>
        {/* <img src={logo} width="100%" /> */}
      </div>

      <div className='col-right'>
        <div className="container text-container">
          <h1 className='anton-regular txt-lg uppercase text-center'>Sign Up</h1>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Joe Doe"
                className={errors.username ? 'is-invalid' : ''}
              />
              {errors.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joe@mail.com"
                className={errors.email ? 'is-invalid' : ''}
              />
              {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
                autoComplete="password"
                className={errors.password ? 'is-invalid' : ''}
              />
              {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>

            <Button type="submit" variant="outline-dark button w-100 mt-2 mb-4">Sign Up</Button>

          </Form>

          <p className="txt-sm mt-4 text-center">
            Do you have an account? <Link to="/sign-in">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
    </DefaultLayout>
  );
}

export default SignUp;

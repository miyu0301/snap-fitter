import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo_v2.png';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import DefaultLayout from '../partials/DefaultLayout';
import { useAuth } from '../auth/AuthProvider';
import Cookies from 'js-cookie';
import { BsEnvelopeFill, BsLockFill, BsPersonFill } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';


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
      const response = await fetch(`${import.meta.env.VITE_API_ENV}/register`, {
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
    <div className='d-flex align-items-center columns'>
      <div className='signup-bg-image bg-image-border bg-cover col-image col-left relative'>
      <div className="div-image-border-radius"></div>
      </div>

      <div className='col-right'>
        <div className="container home-text-container">
          <div className='text-center'>
            <Link to="/"><img src={logo} width={250} alt='Logo of the app' /></Link>
          </div>
          <p className='txt-ms text-center'>Create an account</p>
          
          <Form className='form-w' onSubmit={handleSubmit}>
            
          <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <InputGroup className={errors.username ? 'is-invalid' : ''}>
          <Form.Control
          type="text"
          id="name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Joe Doe"
          />
          <InputGroup.Text>
          <BsPersonFill />
          </InputGroup.Text>
          </InputGroup>
          {errors.username && <Form.Text className="text-danger">{errors.username}</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <InputGroup className={errors.email ? 'is-invalid' : ''}>
          <Form.Control
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="joe@mail.com"          
          />
          <InputGroup.Text>
          <BsEnvelopeFill />
          </InputGroup.Text>
          </InputGroup>
          {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
          </Form.Group>


          <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup className={errors.password ? 'is-invalid' : ''}>
          <Form.Control
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="******"
          autoComplete="password"          
          />
          <InputGroup.Text>
          <BsLockFill />
          </InputGroup.Text>
          </InputGroup>
          {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
          </Form.Group>

          <Button type="submit" variant="outline-dark button w-100 mt-2 mb-4">Sign Up</Button>

          </Form>

          <p className="txt-sm mt-4 text-center">
            Do you have an account?<br/><Link to="/sign-in">Sign in here</Link>
          </p>
          <p className="txt-sm mt-4 text-center"><Link to="/">
              <FaHome className="text-dark" size="1.8em" /></Link>
          </p>
        </div>
      </div>
    </div>
    </DefaultLayout>
  );
}

export default SignUp;

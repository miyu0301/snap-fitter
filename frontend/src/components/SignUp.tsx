import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
//import { getAuth } from "firebase/auth";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
        //const userData = await response.json();
        console.log('Data sent successfully');
        alert("Welcome to fitness App, to continue complete your profile!")
        //localStorage.setItem('username', 'userData.username');
        setIsRegistered(true);

      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }; 

  if (isRegistered) {
    navigate('/your-goals');
  }



const googleButton = document.querySelector('#googleLogin')
googleButton?.addEventListener('click', e => {
 
})

  return (
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
              />
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
              />
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
              />
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
              />
            </Form.Group>       */}

            <Button type="submit" variant="outline-dark button w-100 mt-2 mb-4">Sign Up</Button>

            <div className="text-center"><small>Or</small></div>

            <Button variant="outline-dark w-100 mt-4" id="googleLogin">Continue with Google</Button>

            <Button variant="outline-dark w-100 mt-4">Continue with Facebook</Button>

          </Form>

          <p className="txt-sm mt-4 text-center">
            Do you have an account? <Link to="/sign-in">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

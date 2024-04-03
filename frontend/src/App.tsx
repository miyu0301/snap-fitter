import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//import {Container} from 'react-bootstrap'

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Profile from './components/Profile';
import History from './components/History';

import GoalsForm from './components/GoalsForm';
import LevelForm from './components/LevelForm';
import UserPropertiesForm from './components/UserPropertiesForm';
import Welcome from './components/Welcome';


const App = () => {
  return (
   <>
      <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/your-goals" element={<GoalsForm />} />
        <Route path="/your-level" element={<LevelForm />} />
        <Route path="/generales" element={<UserPropertiesForm />} />

        <Route path="/history" element={<History />} />

        <Route path="/welcome" element={<Welcome />} />
      </Routes>

      </Router>
    </>
  )
}

export default App



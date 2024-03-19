import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Container} from 'react-bootstrap'

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import History from './components/History';

const App = () => {
  return (
   <>
      <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>

      </Router>
    </>
  )
}

export default App



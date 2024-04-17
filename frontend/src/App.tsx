import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Profile from "./components/Profile";
import History from "./components/History";
import Chat from "./components/Chat";

import GoalsForm from "./components/GoalsForm";
import LevelForm from "./components/LevelForm";
import UserPropertiesForm from "./components/UserPropertiesForm";
import Welcome from "./components/Welcome";
import RecordWorkout from "./components/RecordWorkout";

import { AuthProvider } from './auth/AuthProvider.tsx';
import { UserProvider } from './user/userProvider.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import WitoutSession from './routes/WithOutSession.tsx'

const App = () => {
  return (
   <>
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route element={<WitoutSession />}>
                <Route path="/your-goal" element={<GoalsForm />} />
                <Route path="/your-level" element={<LevelForm />} />
                <Route path="/generales" element={<UserPropertiesForm />} />
              </Route>
              <Route path="/history" element={<History />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/record-workout" element={<RecordWorkout />} />
            </Route>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
    </>
  );
};

export default App;

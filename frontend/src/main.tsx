import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'
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
import RecordWorkout from './components/RecordWorkout';
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import Chat from './components/Chat.tsx';

import App from './App.tsx';
// const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Home />,
  // },
  // {
  //   path: "/sign-in",
  //   element: <SignIn />,
  // },
  // {
  //   path: "/sign-up",
  //   element: <SignUp />,
  // },
  // {
  //   path: "/chat",
  //   element: <Chat />,
  // },
  // {
  //   path: "/",
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       path: "/profile",
  //       element: <Profile />,
  //     },
  //     {
  //       path: "/history",
  //       element: <History />,
  //     },
  //     {
  //       path: "/your-goals",
  //       element: <GoalsForm />,
  //     },
  //     {
  //       path: "/your-level",
  //       element: <LevelForm />,
  //     },
  //     {
  //       path: "/generales",
  //       element: <UserPropertiesForm />,
  //     },
  //     {
  //       path: "/welcome",
  //       element: <Welcome />,
  //     },
  //     {
  //       path: "/record-workout",
  //       element: <RecordWorkout />,
  //     },
      
  //   ],
  // },
// ]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

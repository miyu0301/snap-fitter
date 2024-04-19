import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import UserNavbar from '../partials/navbar';
import Timer from './Timer';
import FloatingButton from './FloatingButton';
import { useUser } from '../user/userProvider';
import { useAuth } from '../auth/AuthProvider';
import { fetchActivities } from './CaloriesApi/api';
import { format } from "date-fns";

type Record = {
  id: number;
  exercise_name: string;
  user_id: number;
  start_datetime: string;
  end_datetime: string;
  burned_calories: number;
};

const RecordWorkout: React.FC = () => {
  const user = useUser();
  const [dbUser, setDbUser] = useState(null);
  const auth = useAuth();
  const sessionID: any = auth.getSessionId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData: any = await user.fetchUserData(sessionID);
        setDbUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const [showTimer, setShowTimer] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showWorkoutTime, setShowWorkoutTime] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [record, setRecord] = useState<Record | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false); // Estado de pausa del temporizador

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const apiCalories = await fetchActivities();
        setActivities(apiCalories);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    if (activities.length === 0) {
      fetchActivityData();
    }
  }, [activities]);

  const handleStartClick = () => {
    setShowTimer(true);
    setIsTimerPaused(false); // Reinicia el estado de pausa
    const currentDate = new Date();
    const startDateFormat = format(currentDate, 'yyyy/MM/dd HH:mm:ss');

    if (selectedActivity) {
      const newRecord: Record = {
        id: 1, // Asigna un ID apropiado
        exercise_name: selectedActivity,
        user_id: dbUser.id,
        start_datetime: startDateFormat,
        end_datetime: "",
        burned_calories: 0,
      };
      setRecord(newRecord);
    }
  };

  const handleEndClick = (timeElapsed: number) => {
    if (!isTimerPaused) { // Detener el temporizador solo si no está pausado
      const currentDate = new Date();
      const endDateFormat = format(currentDate, 'yyyy/MM/dd HH:mm:ss');

      setShowTimer(false);
      setWorkoutTime(timeElapsed);
      setShowWorkoutTime(true);
      if (record) {
        setRecord(prevRecord => ({
          ...prevRecord,
          end_datetime: endDateFormat,
        }));
      }
    }
  };

  const handleSelectActivity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivity(event.target.value);
  };

  const calculateCalories = (startTime: Date, endTime: Date, timeElapsed: number): number => {
    console.log(record)
    return 0; // Devuelve un valor apropiado
  };

  useEffect(() => {
    if (record) {
      const endTime = new Date(record.end_datetime);
      const startTime = new Date(record.start_datetime);
      const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000; // Tiempo transcurrido en segundos
      const calories = calculateCalories(startTime, endTime, timeElapsed);
      if (record.burned_calories !== calories) { // Verificar si las calorías han cambiado
        setRecord(prevRecord => ({
          ...prevRecord,
          burned_calories: calories,
        }));
      }
    }
  }, [record]);

  const activitiesStatic = {
    "activities": [
      "Cycling, mountain bike, bmx",
      "Cycling, <10 mph, leisure bicycling",
      "Cycling, >20 mph, racing",
      "Cycling, 10-11.9 mph, light",
      "Cycling, 12-13.9 mph, moderate",
      "Cycling, 14-15.9 mph, vigorous",
      "Cycling, 16-19 mph, very fast, racing",
      "Unicycling",
      "Stationary cycling, very light",
      "Stationary cycling, light",
      "Stationary cycling, moderate",
      "Stationary cycling, vigorous",
    ]
  }

  return (
    <>
      <UserNavbar username={dbUser ? dbUser.username : ''} />
      <div className='d-flex align-items-center justify-items-center'>
        <div className='home-bg-image bg-cover-center col-50'></div>
        <div className='col-50'>
          <div className="container text-container vertical-center-form">
            {!showTimer && !showWorkoutTime ? (
              <div>
                <h2 className='anton-regular txt-md mb-4 text-center'>Record workout</h2>
                <p>Select workout:</p>
                <Form.Select aria-label="Default select example" onChange={handleSelectActivity} value={selectedActivity}>
                  <option>Select type of activity</option>
                  {Object.entries(activitiesStatic.activities).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </Form.Select>
                <div className="text-right">
                  <button className='button btn-solid w-50 mt-4' onClick={handleStartClick}>Start</button>
                </div>
              </div>
            ) : null}
            {showTimer && !showWorkoutTime && (
              <Timer onEnd={handleEndClick} isPaused={isTimerPaused} />
            )}
            {showWorkoutTime && (
              <p>Total workout time: {workoutTime} seconds <br />Calories burned: {record?.burned_calories}</p>
            )}
          </div>
        </div>
        <FloatingButton />
      </div>
    </>
  );
};

export default RecordWorkout;

import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import UserNavbar from '../partials/navbar';
import Timer from './Timer';
import FloatingButton from './FloatingButton';
import { useUser } from '../user/userProvider';
import { useAuth } from '../auth/AuthProvider';
import { fetchActivities, calculateCaloriesBurned } from './CaloriesApi/api';
import { common } from '../Common';
import { API_URL } from '../auth/AuthConstants';
import { Link } from 'react-router-dom';

type Workout = {
  user_id: number  | null;
  exercise_id: number  | null;
  start_datetime: Date | null;
  end_datetime: Date | null;
  pauseStartTime: Date | null;
  pause: number; // Time in seconds that the user was paused
  burned_calories: 0 | null;
};

interface CaloriesResponse {
  calories: number;
}

const RecordWorkout: React.FC = () => {
  const user = useUser();
  const auth = useAuth();
  const sessionID: any = auth.getSessionId();
  const [dbUser, setDbUser] = useState(null);

  const [showTimer, setShowTimer] = useState(false);
  const [workoutTime, setWorkoutTime] = useState<string[]>();
  const [showWorkoutTime, setShowWorkoutTime] = useState(false); //store the total time 
  const [activities, setActivities] = useState<any[]>([]); //store activities from api
  const [selectedActivity, setSelectedActivity] = useState<string>(''); //store the activity selected by the user
  const [isWokoutEnd, setIsWokoutEnd] = useState(false); // Estado de pausa del temporizador  

  const [calories, setCalories] = useState<number | null>(null);

  const [workout, setWorkout] = useState<Workout>({
    user_id: null,
    exercise_id: null,
    start_datetime: null,
    end_datetime: null,
    pauseStartTime: null,
    pause: 0,
    burned_calories: 0,
  });

  useEffect(() => { /// Getting the user data
    const fetchData = async () => {
      try {
        const userData: any = await user.fetchUserData(sessionID);
        setDbUser(userData);
        setWorkout({
          ...workout,
          user_id: userData.id,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);


 
  useEffect(() => {  /// get activities from API
    const fetchActivityData = async () => {
      try {
        const objActivities = await fetchActivities();
        setActivities(objActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    if (activities.length === 0) {
      fetchActivityData();
    }
  }, [activities]);


  const handleStartClick = () => {
    setShowTimer(true);  // Show timer
    setWorkout({
      ...workout,
      start_datetime: new Date(),
    });
  };

  const handlePauseClick = () => {
    if (!workout.pauseStartTime) {
      setWorkout({
        ...workout,
        pauseStartTime: new Date(),
      });
    }
  };

  const handleResumeClick = () => {
    if (workout.pauseStartTime) {
      const pauseEndTime = new Date();
      const pauseDuration = Math.floor((pauseEndTime.getTime() - workout.pauseStartTime.getTime()) / 1000);
      setWorkout({
        ...workout,
        pause: workout.pause + pauseDuration,
      });
    }
  }; 

  const handleEndClick = () => {
    console.log({workout});
    const endTime = new Date();
    setWorkout({
      ...workout,
      end_datetime: endTime,
    });
    console.log(workout.start_datetime)
    const duration = common.calculateDurationForDisplay(workout.start_datetime, endTime, workout.pause);
    //const duration2 = calculateDuration(workout.start_datetime, endTime, workout.pause);
    console.log('Total workout duration:', duration);
    console.log({workout});
    setShowTimer(false);
    setIsWokoutEnd(true)
    setShowWorkoutTime(true);
    setWorkoutTime(duration)
  };  


  const handleSelectActivity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivity(event.target.value);
    setWorkout({
      ...workout,
      exercise_id: event.target.value,
    });
  };

  const saveRecordToDatabase = async (workout: Workout) => {
    console.log({workout})
    try {
      const response = await fetch(`${API_URL}/exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workout)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Data sent successfully:', data);
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // useEffect(()=> {
  //   setWorkout({
  //     ...workout,
  //     burned_calories: calories,
  //   });
  //   console.log('CALORIES')
  //   console.log(workout)
  // }, [calories])

  useEffect(() => {
    console.log(workout)
    if(isWokoutEnd){
    saveRecordToDatabase(workout)
    
    // const caloriesBurned = async () => {
    //   try {
    //     const response = await calculateCaloriesBurned('Unicycling', 30);
    //     setCalories(response.total_calories);
    //     console.log(response.total_calories)
    //   } catch (error) {
    //     console.error('Error calculating calories:', error);
    //   }
    // }; 

    // caloriesBurned()
  }   
  
  }, [isWokoutEnd]);

  const handleStartNewRecord = () => {
    window.location.reload();
  }
  

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
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Form.Select>
                <div className="text-right">
                  <button className='button btn-solid w-50 mt-4' onClick={handleStartClick}>Start</button>
                </div>
              </div>
            ) : null}
            {showTimer && !showWorkoutTime && (
              <Timer             
              onPause={handlePauseClick} 
              onResume={handleResumeClick} 
              onEnd={handleEndClick}             
            />
            )}
            {showWorkoutTime && (
              <div className='text-center'>
              <p>Total workout time: {workoutTime} <br />Calories burned: {workout?.burned_calories}</p>
              <Button className="button btn-solid mt-4" onClick={handleStartNewRecord}>Record new workout</Button>
              <br></br>
              <Link className="button btn-solid mt-4" to="/history">See History</Link>
              </div>
            )}
          </div>
        </div>
        <FloatingButton />
      </div>
    </>
  );
};

export default RecordWorkout;

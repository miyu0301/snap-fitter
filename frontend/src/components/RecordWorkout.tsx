import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import UserNavbar from '../partials/navbar';
import Timer from './Timer';
import FloatingButton from './FloatingButton';
import { useUser } from '../user/userProvider';
import { useAuth } from '../auth/AuthProvider';
import { calculateCaloriesBurned } from './CaloriesApi/api';
import { fetchExercises } from './Exercises/exercises';
import { common } from '../Common';
import { API_URL } from '../auth/AuthConstants';
import { Link } from 'react-router-dom';

type Workout = {
  user_id: number  | null;
  exercise_id: number  | null;
  start_datetime: Date | null;
  end_datetime: Date | null;
  pauseStartTime: Date | null;
  pause: null | number; // Time in seconds that the user was paused
  burned_calories: null;
};

const RecordWorkout: React.FC = () => {
  const user = useUser();
  const auth = useAuth();
  const sessionID: any = auth.getSessionId();
  const [dbUser, setDbUser] = useState(null);

  const [showTimer, setShowTimer] = useState(false);
  const [workoutTime, setWorkoutTime] = useState<string[]>();
  const [showWorkoutTime, setShowWorkoutTime] = useState(false); //store the total time 
  const [activities, setActivities] = useState<[] | any>([]); //store activities from api
  const [selectedActivity, setSelectedActivity] = useState<string>(''); //store the activity selected by the user
  const [selectedActivityName, setSelectedActivityName] = useState<string>('');
  const [isWokoutEnd, setIsWokoutEnd] = useState(false); // Estado de pausa del temporizador 
 
  const [startDateTime, setStartDateTime] = useState<Date | null>(null); // Estado de pausa del temporizador 
  const [endDateTime, setEndDateTime] = useState<Date | null>(null); // Estado de pausa del temporizador 
  const [pauseDuration, setPauseDuration] = useState<Date | null>(null); // Estado de pausa del temporizador  

  const [calories, setCalories] = useState<null | number>(null);

  const [workout, setWorkout] = useState<Workout>({
    user_id: null,
    exercise_id: null,
    start_datetime: null,
    end_datetime: null,
    pauseStartTime: null,
    pause: 0,
    burned_calories: null,
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
        const objActivities = await fetchExercises();
        setActivities(objActivities);
        console.log(objActivities)
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
    const start_datetime = new Date();
    setStartDateTime(start_datetime)
    setWorkout({
      ...workout,
      start_datetime: start_datetime,
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
      setPauseDuration((workout.pause + pauseDuration))
    }
  }; 

  const handleEndClick = async () => {
    console.log({workout});
    const endTime = new Date();
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      end_datetime: endTime,
    }));
    setEndDateTime(endTime)
    const duration = common.calculateDurationForDisplay(workout.start_datetime, endTime, workout.pause);
    let durationMinutes = calculateDurationMinutes(workout.start_datetime, endTime, workout.pause);
    const burnedCalories = await caloriesBurned(selectedActivityName, durationMinutes)  /// llamada a la función asincrona para realizar el 

    setWorkout({
      ...workout,
      burned_calories: burnedCalories,
    });

    setCalories(burnedCalories)
    setShowTimer(false);
    setIsWokoutEnd(true)
    setShowWorkoutTime(true);
    setWorkoutTime(duration)
    
  };  

  const caloriesBurned = async (selectedActivityName:string, duration:number ) => {
    try {
        const response = await calculateCaloriesBurned(selectedActivityName, duration); //función que gestiona la llamada a una api
        return response[0].total_calories
        
      } catch (error) {
         console.error('Error calculating calories:', error);
      }
  };  


  const handleSelectActivity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.selectedOptions[0];
    const name = selectedOption.getAttribute('data-name');
    setSelectedActivity(event.target.value);
    setSelectedActivityName(name ? name : ''); // Si el atributo data-name está presente, establece el valor; de lo contrario, establece
    
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
        return data;
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //tmp function
  const calculateDurationMinutes = (start_datetime: Date, end_datetime: Date, pause:number) => {
    const pause_milliseconds = pause * 1000
    const diff = end_datetime.getTime() - start_datetime.getTime() - pause_milliseconds
    return Math.floor(diff / 60000)
  }


  useEffect(() => {
    //console.log(workout)
    if(isWokoutEnd && calories && endDateTime !== null){
      const workOutBack = { ...workout, user_id: dbUser.id, exercise_id: selectedActivity, start_datetime: startDateTime, end_datetime:endDateTime, pause: pauseDuration, burned_calories: calories };

      console.log({workOutBack})
      const saveDB = saveRecordToDatabase(workOutBack);
      console.log({saveDB})

      console.log("workout is completed")
      console.log(workout)
      console.log(endDateTime)
      console.log(isWokoutEnd)
      console.log(calories)
  }   
  
  }, [isWokoutEnd,calories,endDateTime]);


  const handleStartNewRecord = () => {
    window.location.reload();
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
                {
                activities.map((activity:any, id: number) => {
                return <option data-name={activity.name} value={activity.id} key={id}>{activity.name}</option>;
                })
                }
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

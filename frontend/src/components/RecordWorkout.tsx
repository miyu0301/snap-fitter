import isotype from "../assets/images/isotype.png";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import UserNavbar from "../partials/navbar";
import Timer from "./Timer";
import FloatingButton from "./FloatingButton";
import { useUser } from "../user/userProvider";
import { useAuth } from "../auth/AuthProvider";
import { calculateCaloriesBurned } from "./CaloriesApi/api";
import { fetchExercises } from "./Exercises/exercises";
import { common } from "../Common";
import { API_URL } from "../auth/AuthConstants";
import { Link } from "react-router-dom";
import { GoFlame } from "react-icons/go";
import { MdOutlineTimer } from "react-icons/md";

type Workout = {
  user_id: number | null;
  exercise_id: number | null;
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
  const [selectedActivity, setSelectedActivity] = useState<string>(""); //store the activity selected by the user
  const [selectedActivityName, setSelectedActivityName] = useState<string>("");
  const [isWokoutEnd, setIsWokoutEnd] = useState(false); // Timer pause status

  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null); 
  const [pauseDuration, setPauseDuration] = useState<Date | null>(null);

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

  // Status to store the current status message
  const [statusMessage, setStatusMessage] = useState<string>("");
  
  // State to control the visibility of the loader
  //const [showLoader, setShowLoader] = useState(false);

  // Function to update the status message
  const updateStatusMessage = (message: string) => {
    setStatusMessage(message);
  };

  useEffect(() => {
    /// Getting the user data
    const fetchData = async () => {
      try {
        const userData: any = await user.fetchUserData(sessionID);
        setDbUser(userData);
        setWorkout({
          ...workout,
          user_id: userData.id,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    /// get activities from API
    const fetchActivityData = async () => {
      try {
        const objActivities = await fetchExercises();
        setActivities(objActivities);
        console.log(objActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    if (activities.length === 0) {
      fetchActivityData();
    }
  }, [activities]);

  useEffect(() => {
    if (showTimer) {
      updateStatusMessage(`Countdown started!\nYou can do it!`);
    }
  }, [showTimer]);

  const handleStartClick = () => {
    setShowTimer(true); // Show timer
    const start_datetime = new Date();
    setStartDateTime(start_datetime);
    setWorkout({
      ...workout,
      start_datetime: start_datetime,
    });
  };

  const handlePauseClick = () => {
    updateStatusMessage("Countdown paused. Click 'Resume' to continue.");
    if (!workout.pauseStartTime) {
      setWorkout({
        ...workout,
        pauseStartTime: new Date(),
      });
      
    }
  };

  const handleResumeClick = () => {
    updateStatusMessage("Countdown resumed! Keep strong!");
    if (workout.pauseStartTime) {
      const pauseEndTime = new Date();
      const pauseDuration = Math.floor(
        (pauseEndTime.getTime() - workout.pauseStartTime.getTime()) / 1000
      );
      setWorkout({
        ...workout,
        pause: workout.pause + pauseDuration,
      });
      setPauseDuration(workout.pause + pauseDuration);
      
    }
  };

  const handleEndClick = async () => {
    updateStatusMessage(`We're crunching the numbers...`)
   
    //setShowLoader(true); // Show the loader before showing the workout result
    
    const endTime = new Date();
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      end_datetime: endTime,
    }));
    setEndDateTime(endTime);
    const duration = common.calculateDurationForDisplay(
      workout.start_datetime,
      endTime,
      workout.pause
    );
    let durationMinutes = calculateDurationMinutes(
      workout.start_datetime,
      endTime,
      workout.pause
    );
    const burnedCalories = await caloriesBurned(
      selectedActivityName,
      durationMinutes
    );

    setWorkout({
      ...workout,
      burned_calories: burnedCalories,
    });

    setCalories(burnedCalories);
    setShowTimer(false);
    setIsWokoutEnd(true);
    setShowWorkoutTime(true);
    setWorkoutTime(duration);

    updateStatusMessage("Ta-da! Your results are in! 🚀!");
    //setShowLoader(false);
  };

  const caloriesBurned = async (
    selectedActivityName: string,
    duration: number
  ) => {
    try {
      const response = await calculateCaloriesBurned(
        selectedActivityName,
        duration
      );
      return response[0].total_calories;
    } catch (error) {
      console.error("Error calculating calories:", error);
    }
  };

  const handleSelectActivity = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = event.target.selectedOptions[0];
    const name = selectedOption.getAttribute("data-name");
    setSelectedActivity(event.target.value);
    setSelectedActivityName(name ? name : "");

    setWorkout({
      ...workout,
      exercise_id: event.target.value,
    });
  };

  const saveRecordToDatabase = async (workout: Workout) => {
    try {
      const response = await fetch(`${API_URL}/exercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //tmp function
  const calculateDurationMinutes = (
    start_datetime: Date,
    end_datetime: Date,
    pause: number
  ) => {
    const pause_milliseconds = pause * 1000;
    const diff =
      end_datetime.getTime() - start_datetime.getTime() - pause_milliseconds;
    return Math.floor(diff / 60000);
  };

  useEffect(() => {
    if (isWokoutEnd && calories && endDateTime !== null) {
      const workOutBack = {
        ...workout,
        user_id: dbUser.id,
        exercise_id: selectedActivity,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        pause: pauseDuration,
        burned_calories: calories,
      };

      console.log({ workOutBack });
      const saveDB = saveRecordToDatabase(workOutBack);
      console.log({ saveDB });

      console.log("workout is completed");
      console.log(workout);
      console.log(endDateTime);
      console.log(isWokoutEnd);
      console.log(calories);
    }
  }, [isWokoutEnd, calories, endDateTime]);

  const handleStartNewRecord = () => {
    window.location.reload();
  };

  return (
    <>
      <UserNavbar
        username={dbUser ? dbUser.username : ""}
        imagePath={dbUser ? common.getProfileImagePath(dbUser.image_path) : ""}
      />
      <div className="d-flex align-items-center justify-content-center columns">
        <div className="selectworkout-bg-image bg-cover-center col-50 bg-image-border relative">
          <div className="div-image-border-radius"></div>
        </div>

        <div className="col-50">
          <div className="container text-container align-items-center vertical-center-form">
            <div className="w-100">
              {statusMessage && (
                <div className="text-center mb-3">
                  <p className="text-info">{statusMessage}</p>
                </div>
              )}



              {!showTimer && !showWorkoutTime ? (
                <>
                  <h2 className="anton-regular txt-md mb-4 text-center">
                    Select workout
                  </h2>
                  <Form.Select
                    className="select-custom"
                    aria-label="Default select example"
                    onChange={handleSelectActivity}
                    value={selectedActivity}
                  >
                    <option className="anton-regular">
                      Select type of activity
                    </option>
                    {activities.map((activity: any, id: number) => {
                      return (
                        <option
                          data-name={activity.name}
                          value={activity.id}
                          key={id}
                        >
                          {activity.name}
                        </option>
                      );
                    })}
                  </Form.Select>

                  <div className="text-center">
                    <button
                      className="button btn-solid w-50 mt-4"
                      onClick={handleStartClick}
                    >
                      Start
                    </button>
                  </div>
                </>
              ) : null}
              {showTimer && !showWorkoutTime && (
                <Timer
                  onPause={handlePauseClick}
                  onResume={handleResumeClick}
                  onEnd={handleEndClick}
                />
              )}
              {showWorkoutTime && (
                <div className="text-center">
                  <div className="d-flex justify-content-center align-items-center gap-4">
                    <div className="duration">
                      <p className="mb-0 pb-0">Duration</p>
                      <h2 className="anton-regular">
                        <MdOutlineTimer className="svg-fill" /> {workoutTime}{" "}
                      </h2>
                    </div>
                    <div className="calories">
                      <p className="mb-0 pb-0">Calories</p>
                      <h2 className="anton-regular">
                        <GoFlame className="svg-fill" /> {workout?.burned_calories}
                      </h2>
                    </div>
                  </div>
                  <Button
                    className="btn-solid button bg-dark text-white mt-4 w-50"
                    onClick={handleStartNewRecord}
                  >
                    New workout
                  </Button>
                  <br></br>
                  <Link
                    className="btn-solid button bg-dark text-white mt-4 w-50"
                    to="/history"
                  >
                    See History
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <FloatingButton />
      </div>
    </>
  );
};

export default RecordWorkout;

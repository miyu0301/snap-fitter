const API_KEY = 'g5SfQfEUn+snR1QkXcaL2g==LM4kMKLq31sw7E7u';
const API_BASE_URL = 'https://api.api-ninjas.com/v1/caloriesburnedactivities';
//`https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}`

export const fetchActivities = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`, { //for test
            method: 'GET',
            headers: {
             // 'X-Api-Key': API_KEY,
              'Content-Type': 'application/json'
            }
        });
     
      if (!response.ok) {
        throw new Error('Error fetching activities');
      }
      const data = await response.json();
      return data;

    } catch (error) {
      throw new Error('Error fetching activities');
    }
};


export const calculateCaloriesBurned = async (exercise:string, duration:number) => {
  if(duration <= 0){
    duration = 1;
  }

  try {  
    //exercise: name of the excercise
    //duration: minutes
      const response = await fetch(`https://api.api-ninjas.com/v1/caloriesburned?activity=${exercise}&duration=${duration}`, {
          method: 'GET',
          headers: {
            'X-Api-Key': API_KEY,
            'Content-Type': 'application/json'
          }
      });
   
    if (!response.ok) {
      throw new Error('Error fetching calories');
    }
    const data = await response.json();
    console.log({data})
    return data;

  } catch (error) {
    throw new Error('Error fetching calories');
  }
};


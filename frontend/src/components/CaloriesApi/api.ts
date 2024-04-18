const API_KEY = 'g5SfQfEUn+snR1QkXcaL2g==LM4kMKLq31sw7E7u';
const API_BASE_URL = 'https://api.api-ninjas.com/v1/caloriesburnedactivities';
//`https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}`

export const fetchActivities = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`, {
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


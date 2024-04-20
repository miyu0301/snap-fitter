export const fetchExercises = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_ENV}/m_exercise`, {
            method: 'GET',
            headers: {
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
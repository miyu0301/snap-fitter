import React, { createContext, useContext, useState } from 'react';
import { API_URL } from '../auth/AuthConstants';
import { useAuth } from '../auth/AuthProvider';

interface User {
  goal_id: number;
  level_id: number;
  gender: number;
  birthday: string;
  height: number;
  weight: number;
}

interface UserContextType {
  user: User;
  updateUser: (newUser: Partial<User>) => void;
  fetchUserData: (id:number) => Promise<void>;
  validateUserObject: (user: User) => boolean; // validate if object user is completed
  handleDBUpdate: (user: User) => void;
  //getSessionId: () => string | undefined;
}

type ValidateUserObject = {
  [K in keyof User]: 
  K extends 'goal_id' | 'level_id' 
  ? User[K] extends number ? User[K] extends 0 ? never : User[K] : never
  : K extends 'gender'
  ? User[K] extends 1 | 2 | 3 ? User[K] : never
  : K extends 'birthday' | 'height' | 'weight'
  ? User[K] extends string | number ? User[K] extends '' | undefined ? never : User[K] : never
  : never;
};

const initialUser: User = {
  goal_id: 0,
  level_id: 0,
  gender: 0,
  birthday: '',
  height: 0,
  weight: 0,
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  updateUser: () => {},
  fetchUserData: async () => {},
  validateUserObject: () => false,
  handleDBUpdate: async () => {},
  //getSessionId: () => undefined
});

export const UserProvider: React.FC = ({ children }) => {
  const { getSessionId } = useAuth();
  const [user, setUser] = useState<User>(initialUser);

  const updateUser = (newUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...newUser }));
    console.log('updated')
  };

  //const profileInfo = fetch user id
  

  const handleDBUpdate = async (user: any) => {
   
      try {
        const sessionId = getSessionId(); // We get the session from useAuth
        if (!sessionId) {
          throw new Error('Session not found');
        }
  
        const response = await fetch(`${API_URL}/users/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log(JSON.stringify(responseData));
        } else {
          throw new Error('Request error');
        }
      } catch (error) {
        console.error('Error:', error);
      }

  }

  const fetchUserData = async (id: number) => {
    try {
      const userData = await fetch(`${API_URL}/users/${id}`);
      const userJson = await userData.json();
      setUser(userJson);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  function validateUserObject(obj: User): obj is ValidateUserObject {
    const result = Object.entries(obj).every(([key, value]) => {
      if (key === 'goal_id' || key === 'level_id') {
        return typeof value === 'number' && value !== 0;
      }
      if (key === 'gender') {
        return [1, 2, 3].includes(value);
      }
      if (key === 'birthday' || key === 'height' || key === 'weight') {
        return value !== '' && value !== undefined && value !== 0;
      }
      return false; // If the property is not validated against any of the above conditions, returns false
    });
    console.log(result);
    return result;
  }
  

  return (
    <UserContext.Provider value={{ user, updateUser, fetchUserData, validateUserObject, handleDBUpdate }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

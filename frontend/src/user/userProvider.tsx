import React, { createContext, useContext, useState } from 'react';
import { API_SERVER_URL } from '../auth/AuthConstants';

interface User {
  goal_id: number;
  level_id: number;
  gender: string;
  birthday: string;
  height: number;
  weight: number;
}

interface UserContextType {
  user: User;
  updateUser: (newUser: Partial<User>) => void;
  fetchUserData: (id:number) => Promise<void>;
}

const initialUser: User = {
  goal_id: 0,
  level_id: 0,
  gender: '',
  birthday: '',
  height: 0,
  weight: 0,
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  updateUser: () => {},
  fetchUserData: async () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);

  const updateUser = (newUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...newUser }));
  };

  const fetchUserData = async (id: number) => {
    try {
      const userData = await fetch(`${API_SERVER_URL}/users/${id}`);
      const userJson = await userData.json();
      setUser(userJson);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

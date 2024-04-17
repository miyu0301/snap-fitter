import { useContext, createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    isCompletedBasicInfo: false,
    authenticatedUser: () => {},
    logout: () => {},
    validateSession: () => {},
    getSessionId: () => undefined,
    completedInfo: () => {}
})

function getCookies() {
    const cookies = document.cookie; // Get all cookies
    const cookieArray = cookies.split(';'); // Split string into individual cookies
  
    const cookieObject: any = {};
    cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookieObject[name] = value;
    });
  
    return cookieObject;
  }

const getSession = () => { // Loaded every time the app is loaded to verify that you are authenticated
    const cookies = getCookies();
    const sessionId = cookies['sessionId']
    console.log(sessionId)
    return sessionId
}



export function AuthProvider({children}: AuthProviderProps){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCompletedBasicInfo, setIsCompletedBasicInfo] = useState(false);
    const navigate = useNavigate();

    useEffect(
        () => {
            validateSession();
        }, []
    )

    function validateSession() {
        if (getSession()) {
            authenticatedUser()
        } else {
            logout()
        }
    }

    function authenticatedUser(){ //changes the status of isAuthenticated each time a successful user registration is made
        setIsAuthenticated(true);
    }

    function logout() {
        setIsAuthenticated(false);
        Cookies.remove('sessionId');
        navigate('/sign-in?logout=true');
    }

    // TODO: cambiar por un nombre que indique la accion a ejecutar algo como "se completo la informacion"
    function completedInfo() {
        setIsCompletedBasicInfo(true);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,authenticatedUser,logout,validateSession, getSessionId: getSession, completedInfo, isCompletedBasicInfo}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

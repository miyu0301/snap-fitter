import { useContext, createContext, useState, useEffect } from "react"

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    authenticatedUser: () => {},
    logout: () => {},
    validateSession: () => {},
    getSessionId: () => undefined,
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
    const [isAuthenticated, setIsAuthenticated] = useState(false)

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
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,authenticatedUser,logout,validateSession, getSessionId: getSession}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

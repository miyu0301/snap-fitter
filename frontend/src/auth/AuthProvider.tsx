import { useContext, createContext, useState } from "react"

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    authenticatedUser: () => {},
})

export function AuthProvider({children}: AuthProviderProps){
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    console.log(isAuthenticated)

    function authenticatedUser(){
        setIsAuthenticated(true);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,authenticatedUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

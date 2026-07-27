import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { apiDjango } from '../api/client';


interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (userData: any) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiDjango.get('/me/');

                setIsAuthenticated(true);
                setUser(response.data);
            }
            catch {
                setIsAuthenticated(false);
                setUser(null);
            }
            finally {
                setLoading(false)
            }
        };
        checkAuth();
    },[]);

    const login = (userData:any) => {
        setIsAuthenticated(true);
        setUser(userData)
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loading}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};

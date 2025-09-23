import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

interface User {
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // TODO: migrate from localStorage to sessionStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("project-crm-user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({ op: "verifyUserByEmail", payload: email }),
                headers: { "Content-Type": "text/plain;charset=utf-8" }
            });

            const result = await response.json();
            if (result.status === 'success' && result.data) {
                const userData: User = result.data;
                setUser(userData);
                localStorage.setItem('project-crm-user', JSON.stringify(userData));
            } else {
                throw new Error(result.message || 'User not authorized or not found.');
            }
        } catch (error) {
            console.log("Login failed.", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("project-crm-user");
    }

    const value = { user, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}

export default [AuthProvider, useAuth];

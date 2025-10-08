import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { User } from "../utils/types";
import { API } from "../utils/api";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// TODO: abstract to type.tsx file
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("project-crm-user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // TODO: login failed feedback
    const login = async (email: string) => {
        setIsLoading(true);

        try {
            const verifyResult = await API.verifyEmail(email);
            if (verifyResult) {
                const userData: User = verifyResult;
                console.log("wowowowooo");
                console.log(userData);
                setUser(userData);
                localStorage.setItem('project-crm-user', JSON.stringify(userData));
            } else {
                throw new Error('User not authorized or not found.');
            }
        } catch (error) {
            // TODO: show this information in ui
            console.error("Login failed. User not authorized or not found.", error);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}


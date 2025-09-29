import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { User } from "../utils/types";

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
            // TODO: migrate this to utils/api & api return value data documentation somewhere
            // TODO: abstract this to api file
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({ op: "verifyUserByEmail", payload: { email }, }),
                headers: { "Content-Type": "text/plain;charset=utf-8" }
            });

            const result = await response.json();
            console.log(result);
            if (result.status === 'success' && result.data) {
                // const userData: User = result.data;
                const userData: User = {
                    userID: result.data[0],
                    name: result.data[1],
                    email: result.data[2],
                    roleID: Number(result.data[3]),
                    isAdmin: Boolean(result.data[4])
                }
                setUser(userData);
                localStorage.setItem('project-crm-user', JSON.stringify(userData));
            } else {
                throw new Error(result.message || 'User not authorized or not found.');
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


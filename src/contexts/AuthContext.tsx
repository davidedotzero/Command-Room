import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { User } from "../types/types";
import { API } from "../services/api";
import { useNavigate } from "react-router";
import { ConfirmAlert } from "../components/Swal2/CustomSwalCollection";


// TODO: abstract to type.tsx file
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    async function fetchUser() {
        let data = await API.getUser();
        if (!data) {
            localStorage.removeItem("command-room-token");
            throw new Error("Failed to fetch user.")
        }
        setUser(data);
    }

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem("command-room-token");
        try {
            if (token) {
                fetchUser();
            } else {
                navigate("/login");
            }
        } catch (error) {
            // TODO: better alert
            console.log(error);
            navigate("/whoru");
        } finally {
            setIsLoading(false);
        }
    }, []);

    async function login(token: string) {
        setIsLoading(true);
        try {
            if (!token) {
                throw new Error("Token not found in URL");
            }

            localStorage.setItem('command-room-token', token);
            await fetchUser();
            navigate('/tasks');
        } catch (error) {

            // TODO: proper error page
            console.error(error);
            navigate('/whoru');
        }
        setIsLoading(false);
    }

    const logout = async () => {
        if (!(await ConfirmAlert("จะไปแล้วเหรอม 🥺")).isConfirmed) {
            return;
        }

        setUser(null);
        localStorage.removeItem("command-room-token");
        navigate("/login");
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


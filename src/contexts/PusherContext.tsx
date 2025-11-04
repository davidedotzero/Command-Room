import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import Pusher from "pusher-js";

const PusherContext = createContext<Pusher | null>(null);

export const PusherProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [pusher, setPusher] = useState<Pusher | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            authEndpoint: import.meta.env.VITE_API_URL + "/pusher/auth",
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('command-room-token')}`
                }
            }
        });

        pusherInstance.subscribe("test-channel");
        pusherInstance.subscribe("private-kuy-channel-" + user.userID);

        pusherInstance.subscribe("notify-all");
        pusherInstance.subscribe("private-user-" + user.userID);
        pusherInstance.subscribe("private-team-" + user.teamID);
        // pusherInstance.subscribe("private-div-" + user.divID);

        setPusher(pusherInstance);

        return () => {
            pusherInstance.disconnect();
            setPusher(null);
        };
    }, [user]);

    return (
        <PusherContext.Provider value={pusher}>
            {children}
        </PusherContext.Provider>
    )
}

export const usePusher = () => {
    return useContext(PusherContext);
}

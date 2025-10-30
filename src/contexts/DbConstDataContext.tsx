import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API } from "../utils/api";
import type { DefaultTaskName, PoStatus, TaskStatus, Team } from "../types/types";
import { useAuth } from "./AuthContext";

// =============================== IMPORTANT!!! ===============================
// this is only for fetching data that are considered "constants" from database
// meaning only data that rarely if not at all never ever change
// such as Task Statuses, PO Statuses etc.

interface DbConstContextType {
    DEFAULT_TASK_NAMES: DefaultTaskName[];
    TEAMS: Team[];
    TASK_STATUSES: TaskStatus[];
    // PO_STATUSES: PoStatus[];
}

const DbConstContext = createContext<DbConstContextType | null>(null);

export function DbConstProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const [defaultTaskName, setDefaultTaskName] = useState<DefaultTaskName[]>([]);
    const [team, setTeam] = useState<Team[]>([]);
    const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
    // const [poStatus, setPoStatus] = useState<PoStatus[]>([]);

    const fetchData = async () => {
        const defaultTaskNameResponse = await API.getAllDefaultTaskNames();
        const teamResponse = await API.getAllTeams();
        const taskStatusResponse = await API.getAllTaskStatuses();
        // const poStatusResponse = await API.getAllPoStatuses();

        setDefaultTaskName(defaultTaskNameResponse);
        setTeam(teamResponse);
        setTaskStatus(taskStatusResponse);
        // setPoStatus(poStatusResponse);
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        fetchData();
    }, [user])

    const value: DbConstContextType = {
        DEFAULT_TASK_NAMES: defaultTaskName,
        TEAMS: team,
        TASK_STATUSES: taskStatus,
        // PO_STATUSES: poStatus
    };

    return <DbConstContext.Provider value={value}>{children}</DbConstContext.Provider>
}

export const useDbConst = () => {
    const context = useContext(DbConstContext);
    if (!context) {
        throw new Error('useDbConst must be used within an DbConstProvider.');
    }
    return context;
};


import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API } from "../utils/api";
import type { PoStatus, Role, TaskName, TaskStatus, Team } from "../utils/types";

// =============================== IMPORTANT!!! ===============================
// this is only for fetching data that are considered "constants" from database
// meaning only data that rarely if not at all never ever change
// such as Task Statuses, PO Statuses etc.

interface DbConstContextType {
    TASK_NAMES: TaskName[];
    TEAMS: Team[];
    ROLES: Role[];
    TASK_STATUSES: TaskStatus[];
    PO_STATUSES: PoStatus[];
}

const DbConstContext = createContext<DbConstContextType | null>(null);

export function DbConstProvider({ children }: { children: ReactNode }) {
    const [taskName, setTaskName] = useState<TaskName[]>([]);
    const [team, setTeam] = useState<Team[]>([]);
    const [role, setRole] = useState<Role[]>([]);
    const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
    const [poStatus, setPoStatus] = useState<PoStatus[]>([]);

    const fetchData = async () => {
        const taskNameResponse = await API.getAllTaskNames();
        const teamResponse = await API.getAllTeams();
        const roleResponse = await API.getAllRoles();
        const taskStatusResponse = await API.getAllTaskStatuses();
        const poStatusResponse = await API.getAllPoStatuses();

        setTaskName(taskNameResponse);
        setTeam(teamResponse);
        setRole(roleResponse);
        setTaskStatus(taskStatusResponse);
        setPoStatus(poStatusResponse);
    };

    useEffect(() => {
        fetchData();
    }, [])

    const value: DbConstContextType = { TASK_NAMES: taskName, TEAMS: team, ROLES: role, TASK_STATUSES: taskStatus, PO_STATUSES: poStatus };

    return <DbConstContext.Provider value={value}>{children}</DbConstContext.Provider>
}

export const useDbConst = () => {
    const context = useContext(DbConstContext);
    if (!context) {
        throw new Error('useDbConst must be used within an DbConstProvider.');
    }
    return context;
};


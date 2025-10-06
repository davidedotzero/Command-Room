import { getOnlyDate, msToDay } from "./functions";
import { TASKS, PROJECTS, TEAMS, TASK_STATUSES, EDIT_LOGS, ROLES, PO_STATUSES, leftJoinOne2One, DEFAULT_TASK_NAMES, TASK_USER, USERS } from "./mockdata";
import type { EditLog, FilteringTask, Project, Task, User } from "./types";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
//TODO: IMPORTANT!!!!! this file

export async function callAPI<T>(op: string, payload: object): Promise<T> {
    if (!SCRIPT_URL) throw new Error("VITE_APP_SCRIPT_URL is not defined in env.");

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ op, payload }),
        });

        // TODO: potentially error if api return 302??????????
        if (!response.ok) {
            const errorText = await response.text().catch(() => "N/A");
            console.error("HTTP Error Response:", errorText);
            throw new Error(
                `HTTP error ${response.status}. โปรดตรวจสอบการเชื่อมต่อหรือสถานะเซิร์ฟเวอร์.`
            );
        }

        // 2. อ่านข้อมูลเป็น Text ก่อน (สำคัญมากสำหรับการ Debug และป้องกัน JSON Error)
        const textData = await response.text();

        // 3. พยายามแปลงเป็น JSON
        try {
            const result = JSON.parse(textData);
            // ตรวจสอบสถานะจาก Backend (ตามโครงสร้างที่คาดหวังจาก GAS)
            if (result.status !== "success") {
                throw new Error(
                    result.message || "การดำเนินการล้มเหลว (Backend Error)."
                );
            }
            // ตรวจสอบว่ามี data หรือไม่ ถ้าไม่มีให้ return เป็น object ว่าง
            return (result.data !== undefined ? result.data : {}) as T;
        } catch (parseError) {
            // ดักจับ "SyntaxError: JSON.parse: unexpected character"
            if (parseError instanceof SyntaxError) {
                console.error("Failed to parse JSON. Raw data received:", textData);
                throw new Error(
                    "ได้รับข้อมูลที่ไม่ใช่รูปแบบ JSON. โปรดตรวจสอบ Logs หรือสิทธิ์ของ Google Apps Script."
                );
            }
            throw parseError;
        }
    } catch (error) {
        // จัดการ Network errors
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new Error(
                "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Network Error/CORS)."
            );
        }
        throw error;
    }
}

export const API = {
    getAllTasks: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: delete this simulate delay
        return [...TASKS];
    },
    getAllTasksDetailed: async (): Promise<FilteringTask[]> => {
        const eiei = [...TASKS]
        const tasksJoinTeam = leftJoinOne2One(eiei, TEAMS, "teamID", "teamID", "team");
        const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");
        const tasksJoinTeam_TeamHelp = leftJoinOne2One(tasksJoinStatus, TEAMS, "teamHelpID", "teamID", "teamHelp");

        // getWorkersByTaskID
        let tasksJoinUsers: FilteringTask[] = [];
        for (let juan of tasksJoinTeam_TeamHelp) {
            const userIDsOfTask = TASK_USER.filter(x => x.taskID === juan.taskID);
            const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
            const result: User[] = users.map((x: any) => x.workers);

            tasksJoinUsers.push({ ...juan, workers: result.length === 0 ? null : result })
        }

        return tasksJoinUsers;
    },
    getAllTeams: async () => {
        return [...TEAMS];
    },
    getAllRoles: async () => {
        return [...ROLES];
    },
    getAllTaskStatuses: async () => {
        return [...TASK_STATUSES]
    },
    getAllPoStatuses: async () => {
        return [...PO_STATUSES]
    },
    getAllProjects: async () => {
        return [...PROJECTS];
    },
    getAllDefaultTaskNames: async () => {
        return [...DEFAULT_TASK_NAMES];
    },
    getAllUsersAsc: async () => {
        let eiei = [...USERS];
        eiei.sort((a, b) => a.name.localeCompare(b.name));
        return eiei;
    },


    getAllActiveProjects: async () => {
        return PROJECTS.filter(p => p.isArchived === false);
    },
    getProjectNameById: async (projectID: string) => {
        // TODO: handle when name not found
        return PROJECTS.find(proj => proj.projectID === projectID)?.projectName!;
    },
    getLogsByTaskIdDesc: async (taskID: string) => {
        return EDIT_LOGS.filter(log => log.taskID === taskID).sort((a: EditLog, b: EditLog) => +b.date - +a.date);
    },
    getTasksByProjectId: async (projectID: string) => {
        return TASKS.filter((t) => t.projectID === projectID);
    },
    getTasksByProjectIdDetailed: async (projectID: string): Promise<FilteringTask[]> => {
        const tasksByProjectID = TASKS.filter((t) => t.projectID === projectID);
        const tasksJoinTeam = leftJoinOne2One(tasksByProjectID, TEAMS, "teamID", "teamID", "team");
        const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");
        const tasksJoinTeam_TeamHelp = leftJoinOne2One(tasksJoinStatus, TEAMS, "teamHelpID", "teamID", "teamHelp");

        // getWorkersByTaskID
        let tasksJoinUsers: FilteringTask[] = [];
        for (let juan of tasksJoinTeam_TeamHelp) {
            const userIDsOfTask = TASK_USER.filter(x => x.taskID === juan.taskID);
            const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
            const result: User[] = users.map((x: any) => x.workers);

            tasksJoinUsers.push({ ...juan, workers: result.length === 0 ? null : result })
        }

        return tasksJoinUsers;
    },
    getTasksByUserIdDetailed: async (userID: string): Promise<FilteringTask[]> => {
        const taskUsers = TASK_USER.filter(x => x.userID === userID);
        const tasksFilter = TASKS.filter(x => taskUsers.find(tu => tu.taskID === x.taskID) !== undefined);
        const tasksJoinTeam = leftJoinOne2One(tasksFilter, TEAMS, "teamID", "teamID", "team");
        const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");
        const tasksJoinTeam_TeamHelp = leftJoinOne2One(tasksJoinStatus, TEAMS, "teamHelpID", "teamID", "teamHelp");

        // getWorkersByTaskID
        let tasksJoinUsers: FilteringTask[] = [];
        for (let juan of tasksJoinTeam_TeamHelp) {
            const userIDsOfTask = TASK_USER.filter(x => x.taskID === juan.taskID);
            const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
            const result: User[] = users.map((x: any) => x.workers);

            tasksJoinUsers.push({ ...juan, workers: result.length === 0 ? null : result })
        }

        return tasksJoinUsers;
    },
    getWorkersByTaskId: async (taskID: string) => {
        const userIDsOfTask = TASK_USER.filter(x => x.taskID === taskID);
        const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
        const result: User[] = users.map((x: any) => x.workers)
        return result;
    },

    getLatestTaskID: async () => {
        const tasksSorted = TASKS.sort((a, b) => +b.createdAt - +a.createdAt);
        return tasksSorted[0].taskID;
    },


    getAvgHelpLeadDaysBeforeDeadline: async () => {
        const today = new Date();
        const tasksNeedsHelpButNotOverdue = [...TASKS]
            .filter(task => task.helpReqAt)
            .filter(task => task.deadline > today);

        const totalHelpLeadDay = tasksNeedsHelpButNotOverdue
            .reduce((acc, task) => {
                return acc + msToDay(+getOnlyDate(task.deadline) - +getOnlyDate(today))
            }, 0);

        const avgHelpLeadDaysBeforeDeadline = totalHelpLeadDay / tasksNeedsHelpButNotOverdue.length;

        return avgHelpLeadDaysBeforeDeadline.toFixed(1);
    },


    addTask: async (newTask: Task) => {
        TASKS.push(newTask);
        return true;
    },
    addTasks: async (tasks: Task[]) => {
        for (let task of tasks) {
            TASKS.push(task);
        }
        return true;
    },
    addEditLog: async (newLog: EditLog) => {
        EDIT_LOGS.push(newLog);
        return true;
    },
    addProject: async (newProject: Project) => {
        PROJECTS.push(newProject);
        return true;
    },
    addTaskUsers: async (taskID: string, users: User[]) => {
        for (let user of users) {
            TASK_USER.push({ taskID: taskID, userID: user.userID })
        }
        return true;
    },

    updateTask: async (
        taskID: string,
        taskName: string,
        teamID: number,
        deadline: Date | null,
        teamHelpID: number | null,
        helpReqAt: Date | null,
        taskStatusID: number | null,
        logPreview: string,
        helpReqReason: string | null) => {

        for (let task of TASKS) {
            if (taskID === task.taskID) {
                task.taskName = taskName;
                task.teamID = teamID;
                task.deadline = deadline ?? task.deadline;
                task.teamHelpID = teamHelpID;
                task.helpReqAt = helpReqAt;
                task.helpReqReason = helpReqReason;
                task.statusID = taskStatusID ?? task.statusID;
                task.logPreview = logPreview;
                break;
            }
        }
    },
    updateProjectNameAtId: async (projectID: string, newProjectName: string) => {
        for (let project of PROJECTS) {
            if (projectID === project.projectID) {
                project.projectName = newProjectName;
                break;
            }
        }
        return true;
    },

    deleteProjectById: async (projectID: string) => {
        let found = PROJECTS.find(project => project.projectID === projectID);
        if (!found) return false;

        for (let project of PROJECTS) {
            if (projectID === project.projectID) {
                project.isArchived = true;
                break;
            }
        }
        return true;
    },
    deleteTaskUsers: async (taskID: string, usersToDelete: User[]) => {
        let taskUserByTaskID = TASK_USER.filter(x => x.taskID === taskID);
        for (let taskUser of taskUserByTaskID) {
            for (let user of usersToDelete) {
                if (taskUser.userID === user.userID) {
                    const filtered = TASK_USER.filter(x => !(x.taskID === taskUser.taskID && x.userID === user.userID));

                    // WARNING: bodge asf cuz js imports are fucking immutable and we cant change it cuz js devs wanna shove functional paradigm and "purity" bullshit up our ass cuz this language did not have enough shit in it like our beloved c++ amirite?
                    // fuck it its mock api anyway
                    TASK_USER.splice(0, TASK_USER.length); // remove everything in place
                    TASK_USER.push(...filtered);

                    // WARNING: see? and we can still mutate it anyway so whats the fucking point?
                    // and also why this lang does not have inplace filter function? its so confusing having to remind ourselves that this function mutates, but this does not ITS MAD!!!!!!
                }
            }
        }
        return true;
    },


    isProjectIDExists: async (projectID: string) => {
        return PROJECTS.some(proj => proj.projectID === projectID);
    }
}

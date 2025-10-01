import { TASKS, PROJECTS, TEAMS, TASK_STATUSES, EDIT_LOGS, ROLES, PO_STATUSES, TASK_NAMES, leftJoinOne2One } from "./mockdata";
import type { EditLog, FilteringTask, Task } from "./types";

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
    getAllTasksDetailed: async () => {
        const eiei = [...TASKS];
        const tasksJoinTaskName = leftJoinOne2One(eiei, TASK_NAMES, "taskNameID", "taskNameID", "taskName");
        const tasksJoinTeam = leftJoinOne2One(tasksJoinTaskName, TEAMS, "teamID", "teamID", "team");
        const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");
        const tasksJoinTeam_TeamHelp = leftJoinOne2One(tasksJoinStatus, TEAMS, "teamHelpID", "teamID", "teamHelp");
        return tasksJoinTeam_TeamHelp;
    },
    getAllTaskNames: async () => {
        return [...TASK_NAMES];
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
        const tasksJoinTaskName = leftJoinOne2One(tasksByProjectID, TASK_NAMES, "taskNameID", "taskNameID", "taskName");
        const tasksJoinTeam = leftJoinOne2One(tasksJoinTaskName, TEAMS, "teamID", "teamID", "team");
        const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");
        const tasksJoinTeam_TeamHelp = leftJoinOne2One(tasksJoinStatus, TEAMS, "teamHelpID", "teamID", "teamHelp");
        return tasksJoinTeam_TeamHelp;
    },



    addTasks: async (newTask: Task) => {
        TASKS.push(newTask);
        return true;
    },
    addEditLog: async (newLog: EditLog) => {
        EDIT_LOGS.push(newLog);
        return true;
    },


    updateTask: async (taskID: string, deadline: Date | null, teamHelpID: number | null, helpReqAt: Date | null, taskStatusID: number | null, logPreview: string) => {
        for (let task of TASKS) {
            if (taskID === task.taskID) {
                task.deadline = deadline ?? task.deadline;
                task.teamHelpID = teamHelpID ?? task.teamHelpID;
                task.helpReqAt = helpReqAt ?? task.helpReqAt;
                task.statusID = taskStatusID ?? task.statusID;
                task.logPreview = logPreview;
                break;
            }
        }
    },


    isProjectIDExists: async (projectID: string) => {
        return PROJECTS.some(proj => proj.projectID === projectID);
    }
}

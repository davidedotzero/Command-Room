import { getOnlyDate, msToDay } from "./functions";
import { TASKS, PROJECTS, TEAMS, TASK_STATUSES, EDIT_LOGS, PO_STATUSES, leftJoinOne2One, TASK_USER, USERS, CUSTOMERS, CUSTOMER_TYPES, POs } from "./mockdata";
import type { DetailedCustomer, DetailedPO, EditLog, FilteringTask, Project, Task, TaskStatus, Team, User } from "./types";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
//TODO: IMPORTANT!!!!! this file

// export async function callAPI<T>(op: string, payload: object): Promise<T> {
//     if (!SCRIPT_URL) throw new Error("VITE_APP_SCRIPT_URL is not defined in env.");
//
//     try {
//         const response = await fetch(SCRIPT_URL, {
//             method: "POST",
//             headers: { "Content-Type": "text/plain;charset=utf-8" },
//             body: JSON.stringify({ op, payload }),
//         });
//
//         // TODO: potentially error if api return 302??????????
//         if (!response.ok) {
//             const errorText = await response.text().catch(() => "N/A");
//             console.error("HTTP Error Response:", errorText);
//             throw new Error(
//                 `HTTP error ${response.status}. โปรดตรวจสอบการเชื่อมต่อหรือสถานะเซิร์ฟเวอร์.`
//             );
//         }
//
//         // 2. อ่านข้อมูลเป็น Text ก่อน (สำคัญมากสำหรับการ Debug และป้องกัน JSON Error)
//         const textData = await response.text();
//
//         // 3. พยายามแปลงเป็น JSON
//         try {
//             const result = JSON.parse(textData);
//             // ตรวจสอบสถานะจาก Backend (ตามโครงสร้างที่คาดหวังจาก GAS)
//             if (result.status !== "success") {
//                 throw new Error(
//                     result.message || "การดำเนินการล้มเหลว (Backend Error)."
//                 );
//             }
//             // ตรวจสอบว่ามี data หรือไม่ ถ้าไม่มีให้ return เป็น object ว่าง
//             return (result.data !== undefined ? result.data : {}) as T;
//         } catch (parseError) {
//             // ดักจับ "SyntaxError: JSON.parse: unexpected character"
//             if (parseError instanceof SyntaxError) {
//                 console.error("Failed to parse JSON. Raw data received:", textData);
//                 throw new Error(
//                     "ได้รับข้อมูลที่ไม่ใช่รูปแบบ JSON. โปรดตรวจสอบ Logs หรือสิทธิ์ของ Google Apps Script."
//                 );
//             }
//             throw parseError;
//         }
//     } catch (error) {
//         // จัดการ Network errors
//         if (error instanceof TypeError && error.message === "Failed to fetch") {
//             throw new Error(
//                 "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Network Error/CORS)."
//             );
//         }
//         throw error;
//     }
// }

// const apiURL = "https://command-room-backend.vercel.app/api/"
const apiURL = "http://localhost:8080/api/";

async function getAPI(endpoint: string, param: string = ""): Promise<any> {
    // TODO: handle error responses
    const res = await fetch(apiURL + endpoint + "/" + param);
    const data = await res.json();
    return data;
}

async function postAPI(endpoint: string, body: any): Promise<any> {
    try {
        const response = await fetch(apiURL + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Success:', result);
        alert('POST api done successfully!');

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to run POST api.');
    }
}


export const API = {
    // TODO: THIS AUTH METHOD IS SHIT, MUST USE BETTER AUTH LATER KUYKUYUKYUKYUKYKUYKUYKUYKUYKUYKUKYUKYUYKUYKU
    verifyEmail: async (email: string) => {
        let response = await getAPI("verifyEmail", email);
        if (!response || response.length <= 0) {
            console.log("meung krai ni");
            return null;
        }

        return response[0];
    },
    getAllTasksDetailed: async (): Promise<FilteringTask[]> => {
        let data: FilteringTask[] = await getAPI("getAllTasksDetailed");

        // need to parse date here cuz backend cant send Date obj to us sadge
        data = data.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: new Date(row.createdAt),
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        })

        return data;
    },
    getAllTeams: async (): Promise<Team[]> => {
        const data = await getAPI("getAllTeams");
        return data;
    },
    getAllTaskStatuses: async (): Promise<TaskStatus[]> => {
        const data = await getAPI("getAllTaskStatuses");
        return data;
    },
    getAllPoStatuses: async () => {
        return [...PO_STATUSES]
    },
    getAllProjects: async () => {
        const data = await getAPI("getAllProjects")
        return data;
    },
    getAllDefaultTaskNames: async () => {
        const data = await getAPI("getAllDefaultTaskNames");
        return data;
    },
    getAllUsersAsc: async () => {
        const data = await getAPI("getAllUsersAsc");
        return data;
    },


    getAllActiveProjects: async () => {
        const data = await getAPI("getAllActiveProjects");
        return data;
    },
    getProjectNameById: async (projectID: string) => {
        // // TODO: handle when name not found maybe in backend?
        const data = await getAPI("getProjectNameById", projectID);
        return data.projectName;
    },
    getLogsByTaskIdDesc: async (taskID: string) => {
        let data: EditLog[] = await getAPI("getLogsByTaskIdDesc", taskID);
        data = data.map(row => {
            return {
                ...row,
                date: new Date(row.date),
                fromDeadline: row.fromDeadline !== null ? new Date(row.fromDeadline) : null,
                toDeadline: row.toDeadline !== null ? new Date(row.toDeadline) : null
            };
        })
        return data;
    },
    getTasksByProjectIdDetailed: async (projectID: string): Promise<FilteringTask[]> => {
        let res: FilteringTask[] = await getAPI("getTasksByProjectIdDetailed", projectID);

        // need to parse date here cuz backend cant send Date obj to us sadge
        res = res.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: new Date(row.createdAt),
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        })

        return res;
    },
    getTasksByUserIdDetailed: async (userID: string): Promise<FilteringTask[]> => {
        console.log(userID);
        let res: FilteringTask[] = await getAPI("getTasksByUserIdDetailed", userID);
        console.log(res);

        // need to parse date here cuz backend cant send Date obj to us sadge
        res = res.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: new Date(row.createdAt),
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        })

        return res;
    },
    getWorkersByTaskId: async (taskID: string) => {
        const userIDsOfTask = TASK_USER.filter(x => x.taskID === taskID);
        const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
        const result: User[] = users.map((x: any) => x.workers)
        return result;
    },
    getPOandCustomerDetailByTaskID: async (taskID: string) => { // TODO: type this shit
        const po = POs.filter(x => x.taskID === taskID);

        const poJoinCustomer = leftJoinOne2One(po, CUSTOMERS, "customerID", "customerID", "customer");
        // WARNING: assume that this will have 1 only object cuz im bodging this sheeshhhhhhhhhhhhh
        console.log("kuy");
        console.log(poJoinCustomer);
        return poJoinCustomer[0];
    },

    getLatestTaskID: async () => {
        const data = await getAPI("getLatestTaskID");
        console.log(data);
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
        const response = await postAPI("addTask", newTask);
        // TODO: handle response???
        return response;
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
                task.taskStatusID = taskStatusID ?? task.taskStatusID;
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
        const data = await getAPI("isProjectIDExists", projectID);
        return Boolean(data.isValid);
        // return PROJECTS.some(proj => proj.projectID === projectID);
    },

    countCustomersPOs: async () => {
        const poCountGroupByCustomerID = POs.reduce(
            (acc, po) => {
                const key = po.customerID;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {}
        );

        return poCountGroupByCustomerID;
    },
    countInCompleteCustomersPOs: async () => {
        throw new Error("NOT IMPLEMENTED");

        const poCountGroupByCustomerID = POs.reduce(
            (acc, po) => {
                if (po.poStatusID)
                    // const key = po.customerID;
                    acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {}
        );

        return poCountGroupByCustomerID;
    },

    getAllCustomers: async () => {
        return [...CUSTOMERS];
    },
    getAllCustomersDetailed: async (): Promise<DetailedCustomer[]> => {
        const customers = [...CUSTOMERS];

        let customersJoinCustomerType = leftJoinOne2One(customers, CUSTOMER_TYPES, "customerTypeID", "customerTypeID", "customerType");

        return customersJoinCustomerType;
    },
    getAllPOs: async () => {
        return [...POs];
    },
    getAllPOsDetailed: async (): Promise<DetailedPO[]> => {
        const pos = [...POs];

        const posJoinCustomer = leftJoinOne2One(pos, CUSTOMERS, "customerID", "customerID", "customer");
        const posJoinPoStatus = leftJoinOne2One(posJoinCustomer, PO_STATUSES, "poStatusID", "poStatusID", "poStatus");

        return posJoinPoStatus;
    },
}

import { removeLastZchar } from "./functions";
import { PO_STATUSES, leftJoinOne2One, TASK_USER, USERS, CUSTOMERS, CUSTOMER_TYPES, POs } from "./mockdata";
import type { DetailedCustomer, DetailedPO, EditLog, FilteringTask, Project, Task, TaskStatus, Team, User, NewTask, EditLogDetailed } from "./types";

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

const apiURL = import.meta.env.VITE_API_URL;

async function getAPI(endpoint: string, param: string = ""): Promise<any> {
    try {
        const res = await fetch(apiURL + endpoint + "/" + param);

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        let data = null;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else if (contentType && contentType.includes('multipart/form-data')) {
            data = await res.formData();
        } else {
            data = await res.text();
        }

        return data;
    } catch (error) {
        console.error("Error: ", error);
    }
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
        // TODO: change there alerts

        // alert('POST api done successfully!');

    } catch (error) {
        console.error('Error:', error);
        // alert('Failed to run POST api.');
    }
}

async function putAPI(endpoint: string, body: any): Promise<any> {
    try {
        const response = await fetch(apiURL + endpoint, {
            method: 'PUT',
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
        // TODO: change there alerts

        // alert('PUT api done successfully!');

    } catch (error) {
        console.error('Error:', error);
        // alert('Failed to run PUT api.');
    }
}

async function patchAPI(endpoint: string, body: any, param: string = ""): Promise<any> {
    try {
        const response = await fetch(apiURL + endpoint + "/" + param, {
            method: 'PATCH',
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
        // TODO: change there alerts

        // alert('PATCH api done successfully!');

    } catch (error) {
        console.error('Error:', error);
        // alert('Failed to run PATCH api.');
    }
}

async function deleteAPI(endpoint: string, body: any): Promise<any> {
    try {
        const response = await fetch(apiURL + endpoint, {
            method: 'DELETE',
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
        // TODO: change there alerts

        // alert('DELETE api done successfully!');

    } catch (error) {
        console.error('Error:', error);

        // alert('Failed to run DELETE api.');
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

        return response;
    },
    getAllTasksDetailed: async (): Promise<FilteringTask[]> => {
        let data: FilteringTask[] = await getAPI("tasks");
        console.log(data);

        // TODO: check responses

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
        const data = await getAPI("const/teams");
        return data;
    },
    getAllTaskStatuses: async (): Promise<TaskStatus[]> => {
        const data = await getAPI("const/taskStatuses");
        return data;
    },
    getAllPoStatuses: async () => {
        return [...PO_STATUSES]
    },
    getAllProjects: async () => {
        const data = await getAPI("projects")
        return data;
    },
    getAllDefaultTaskNames: async () => {
        const data = await getAPI("const/defaultTaskNames");
        return data;
    },
    getAllUsersAsc: async () => {
        const data = await getAPI("getAllUsersAsc");
        return data;
    },


    getAllActiveProjects: async () => {
        const data = await getAPI("projects/active");
        return data;
    },
    getProjectNameById: async (projectID: string) => {
        // // TODO: handle when name not found maybe in backend?
        const data = await getAPI("projects/name", projectID);
        return data.projectName;
    },
    getLogsByTaskIdDesc: async (taskID: string) => {
        let data: EditLogDetailed[] = await getAPI("logs/edit", taskID);
        console.log("pre");
        console.log(data);
        data = data.map(row => {
            return {
                ...row,
                date: row.date === null ? null : new Date(removeLastZchar(row.date)), // super low iq fix for UTC timestamp sent from db
                fromDeadline: row.fromDeadline !== null ? new Date(row.fromDeadline) : null,
                toDeadline: row.toDeadline !== null ? new Date(row.toDeadline) : null
            };
        });
        console.log("post");
        console.log(data);
        return data;
    },
    getTasksByProjectIdDetailed: async (projectID: string): Promise<FilteringTask[]> => {
        let res: FilteringTask[] = await getAPI("tasks/pid", projectID);

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
        let res: FilteringTask[] = await getAPI("tasks/uid", userID);
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

    getNewTaskID: async () => {
        const data = await getAPI("gen_ids/task");
        return data;
    },


    getAvgHelpLeadDaysBeforeDeadline: async () => {
        const data = await getAPI("getAvgHelpLeadDaysBeforeDeadline");
        return data.avgHelpLeadDay;
    },
    getWorkersByTaskId: async (taskID: string) => {
        const userIDsOfTask = TASK_USER.filter(x => x.taskID === taskID);
        const users = leftJoinOne2One(userIDsOfTask, USERS, "userID", "userID", "workers");
        const result: User[] = users.map((x: any) => x.workers)
        return result;
    },

    addTask: async (newTask: Task) => {
        const response = await postAPI("tasks", newTask);
        // TODO: handle response???
        return response;
    },
    addEditLog: async (newLog) => {
        const response = await postAPI("logs/edit", newLog);
        return response;
    },

    updateTaskByTaskID: async (updateTask: {
        taskName: string,
        deadline: Date | null,
        taskStatusID: number | null,
        teamHelpID: number | null,
        helpReqAt: Date | null,
        helpReqReason: string | null
        logPreview: string,
        teamID: number,
        taskID: string,
    }) => {
        const response = await putAPI("tasks", updateTask);
        return response;
    },

    updateProjectNameAtId: async (projectID: string, newProjectName: string) => {
        const response = patchAPI("projects/name", { newProjectName }, projectID);
        return response;
    },
    deleteProjectById: async (projectID: string, isArchived: boolean = true) => {
        const response = patchAPI("projects/archive", { isArchived }, projectID);
        return response;
    },

    addTaskUsers: async (taskID: string, usersToAdd: User[]) => {
        let body = {
            taskID: taskID,
            users: usersToAdd
        };

        const response = postAPI("taskusers", body);
        return response;
    },
    deleteTaskUsers: async (taskID: string, usersToDelete: User[]) => {
        let body = {
            taskID: taskID,
            users: usersToDelete
        };

        const response = deleteAPI("taskusers", body);
        return response;
    },
    addProjectAndTasks: async (projectName: string, projectTasks: NewTask[]) => {
        const body = {
            projectName: projectName,
            tasks: projectTasks
        };

        const response = postAPI("projects", body);
        return response;
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
    getPOandCustomerDetailByTaskID: async (taskID: string) => { // TODO: type this shit
        const po = POs.filter(x => x.taskID === taskID);

        const poJoinCustomer = leftJoinOne2One(po, CUSTOMERS, "customerID", "customerID", "customer");
        // WARNING: assume that this will have 1 only object cuz im bodging this sheeshhhhhhhhhhhhh
        console.log("kuy");
        console.log(poJoinCustomer);
        return poJoinCustomer[0];
    },
}

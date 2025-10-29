import { removeLastZchar } from "./functions";

import type { DetailedCustomer, DetailedPO, EditLog, FilteringTask, Project, Task, TaskStatus, Team, User, NewTask, EditLogDetailed } from "./types";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { ErrorAlertDetailed, SuccessAlert } from "../functions/Swal2/CustomSwalCollection";

const apiURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('command-room-token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

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

        const result = await response.json();

        if (!response.ok) {
            ErrorAlertDetailed(result.message, result.detail);
        } else {
            SuccessAlert(result.message);
        }

        return response;
    } catch (error) {
        ErrorAlertDetailed("Failed to call PATCH api", "" + error);
        return Response.error();
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

        console.log(response);
        const result = await response.json();

        if (!response.ok) {
            ErrorAlertDetailed(result.message, result.detail);
        } else {
            SuccessAlert(result.message);
        }

    } catch (error) {
        ErrorAlertDetailed("Failed to call PUT api", "" + error);
        return Response.error();
    }
}

async function patchAPI(endpoint: string, body: any, param: string = ""): Promise<Response> {
    try {
        const response = await fetch(apiURL + endpoint + "/" + param, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
            ErrorAlertDetailed(result.message, result.detail);
        } else {
            SuccessAlert(result.message);
        }

        return response;
    } catch (error) {
        ErrorAlertDetailed("Failed to call PATCH api", "" + error);
        return Response.error();
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
    getWorkers: async () => {
        const data = await getAPI("getWorkers");
        return data;
    },


    getAllActiveProjectsDetailed: async () => {
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
        let resultData = data.map(row => {
            return {
                ...row,
                date: row.date === null ? null : new Date(removeLastZchar(row.date)), // super low iq fix for UTC timestamp sent from db
                fromDeadline: row.fromDeadline !== null ? new Date(row.fromDeadline) : null,
                toDeadline: row.toDeadline !== null ? new Date(row.toDeadline) : null
            };
        });
        return resultData;
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

    updateProjectNameAtId: async (projectID: string, newProjectName: string) => {
        const response = await patchAPI("projects/name", { newProjectName }, projectID);
        return response;
    },
    deleteProjectById: async (projectID: string, isArchived: boolean = true) => {
        const response = await patchAPI("projects/archive", { isArchived }, projectID);
        return response;
    },

    addProjectAndTasks: async (projectName: string, projectTasks: NewTask[]) => {
        const body = {
            projectName: projectName,
            tasks: projectTasks
        };

        const response = await postAPI("projects", body);
        return response;
    },

    markLogs: async (toMarkLogIDs: Array<string>, toUnmarkLogIDs: Array<string>) => {
        const body = {
            markLogs: toMarkLogIDs,
            unmarkLogs: toUnmarkLogIDs
        }

        const response = await patchAPI("logs/edit/marks", body);
        return response;
    },


    addTaskUsers: async (taskID: string, usersToAdd: User[]) => {
        let body = {
            taskID: taskID,
            users: usersToAdd
        };

        const response = await postAPI("taskusers", body);
        return response;
    },
    deleteTaskUsers: async (taskID: string, usersToDelete: User[]) => {
        let body = {
            taskID: taskID,
            users: usersToDelete
        };

        const response = await deleteAPI("taskusers", body);
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
    updateTask: async (updateTask, newLog, toAddUsers, toDelUsers) => {
        let body = {
            updateTask: updateTask,
            newLog: newLog,
            toAddUsers: toAddUsers,
            toDelUsers: toDelUsers
        };

        const response = await putAPI("tasks", body);
        return response;
    },



    isProjectIDExists: async (projectID: string) => {
        const data = await getAPI("isProjectIDExists", projectID);
        return Boolean(data.isValid);
        // return PROJECTS.some(proj => proj.projectID === projectID);
    },

    // ===============================================================================================================
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

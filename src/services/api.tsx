import axios from "axios";
import type { FilteringTask, Task, TaskStatus, Team, NewTask, EditLogDetailed, NotificationDetailed } from "../types/types";
import { ErrorAlertDetailed, SuccessAlert } from "../components/Swal2/CustomSwalCollection";
import { removeLastZchar } from "../utils/functions";

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

api.interceptors.response.use(
    (response) => {
        if (response.config.alert) {
            SuccessAlert(response.data.message);
        }
        return response;
    },
    (error) => {
        const alert: boolean = Boolean(error.response.config.alert || error.config.alert)
        if (!error.response) {
            if (alert) {
                ErrorAlertDetailed("Failed to call api", "" + error);
            }
            return Promise.reject(error);
        }

        if (error.response.status === 401) {
            console.warn('401 Unauthorized: Redirecting to login page.');

            window.location.href = '/login';
            localStorage.removeItem('command-room-token');
            return Promise.reject(error);
        }

        if (alert) {
            console.log(error);
            ErrorAlertDetailed(error.response.data.message, error.response.data.detail);
        }
        return Promise.reject(error);
    }
);

export const API = {
    getUserEarlierNotis: async (userID: string, pageNumber: number) => {
        let result = await api.get(`/noti/user/${userID}/page/${pageNumber}`);
        // TODO: type {hasMorePage, notifications} later
        let data = {
            ...result.data,
            notifications: result.data.notifications.map((row: NotificationDetailed) => {
                return {
                    ...row,
                    createdAt: row.createdAt === null ? null : new Date(removeLastZchar(row.createdAt)), // super low iq fix for UTC timestamp sent from db
                }
            })
        }
        return data;
    },

    getUserNotis: async (userID: string): Promise<NotificationDetailed[]> => {
        let result = await api.get(`/noti/user/${userID}`);
        let data: NotificationDetailed[] = result.data.map((row: NotificationDetailed) => {
            return {
                ...row,
                createdAt: row.createdAt === null ? null : new Date(removeLastZchar(row.createdAt)), // super low iq fix for UTC timestamp sent from db
            };
        });
        return data;
    },

    setUserNotiSeenAll: async (userID: string) => {
        let result = await api.patch(`/noti/mark-seen/${userID}`);
        return result;
    },

    getUserNotiUnseenCount: async (userID: string) => {
        let result = await api.get(`/noti/unseen-count/${userID}`);
        return result.data;
    },

    notify_all: async (senderID: string | null, notificationTypeID: number, message: string, linkTargetID: string | null) => {
        let result = await api.post("/noti/all", { senderID: senderID, notificationTypeID: notificationTypeID, message: message, linkTargetID: linkTargetID });
        return result;
    },

    notify_team: async (senderID: string | null, notificationTypeID: number, message: string, linkTargetID: string | null, teamID: number) => {
        let result = await api.post("/noti/teams", { senderID: senderID, notificationTypeID: notificationTypeID, message: message, linkTargetID: linkTargetID, teamID: teamID });
        return result;
    },

    getUser: async () => {
        let result = await api.get("/user/me");
        return result.data;
    },

    getUserById: async (userID: string) => {
        let result = await api.get(`/user/${userID}`);
        return result.data;
    },

    getAllTasksDetailed: async (): Promise<FilteringTask[]> => {
        let response = await api.get("/tasks");
        let data = response.data;

        // need to parse date here cuz backend cant send Date obj to us sadge
        data = data.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: row.createdAt !== null ? new Date(row.createdAt) : null,
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        });

        return data;
    },

    getAllTeams: async (): Promise<Team[]> => {
        const response = await api.get("/const/teams");
        return response.data;
    },

    getAllTaskStatuses: async (): Promise<TaskStatus[]> => {
        const response = await api.get("/const/taskStatuses");
        return response.data;
    },

    getAllProjects: async () => {
        const response = await api.get("/projects")
        return response.data;
    },

    getAllDefaultTaskNames: async () => {
        const response = await api.get("/const/defaultTaskNames");
        return response.data;
    },

    getWorkers: async () => {
        const response = await api.get("/getWorkers");
        return response.data;
    },

    getAllActiveProjectsDetailed: async () => {
        const response = await api.get("/projects/active");
        return response.data;
    },

    getProjectNameById: async (projectID: string) => {
        const response = await api.get(`/projects/name/${projectID}`);
        return response.data.projectName;
    },

    getLogsByTaskIdDesc: async (taskID: string) => {
        const response = await api.get(`/logs/edit/${taskID}`);
        const data: EditLogDetailed[] = response.data;

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
        const response = await api.get(`/tasks/pid/${projectID}`);
        let data: FilteringTask[] = response.data;

        // need to parse date here cuz backend cant send Date obj to us sadge
        data = data.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: row.createdAt !== null ? new Date(row.createdAt) : null,
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        })

        return data;
    },

    getTasksByUserIdDetailed: async (userID: string): Promise<FilteringTask[]> => {
        const response = await api.get(`/tasks/uid/${userID}`);
        let data: FilteringTask[] = response.data;

        // need to parse date here cuz backend cant send Date obj to us sadge
        data = data.map(row => {
            return {
                ...row,
                deadline: new Date(row.deadline),
                createdAt: row.createdAt !== null ? new Date(row.createdAt) : null,
                updatedAt: row.updatedAt !== null ? new Date(row.updatedAt) : null
            };
        })

        return data;
    },

    // TODO: this should be handled in the database instead but it works so im not gonna touch it xdddd
    getNewTaskID: async () => {
        const response = await api.get("/gen_ids/task");
        return response.data;
    },

    getAvgHelpLeadDaysBeforeDeadline: async () => {
        const response = await api.get("/kpi/avg-help-lead-days");
        return response.data.avgHelpLeadDay;
    },

    addTask: async (newTask: Task) => {
        const response = await api.post("/tasks", { ...newTask }, { alert: true })
        return response;
    },

    updateProjectNameById: async (projectID: string, newProjectName: string) => {
        const response = await api.patch(`/projects/name/${projectID}`, { newProjectName: newProjectName }, { alert: true });
        return response;
    },

    deleteProjectById: async (projectID: string, isArchived: boolean = true) => {
        const response = await api.patch(`/projects/archive/${projectID}`, { isArchived: isArchived }, { alert: true });
        return response;
    },

    addProjectAndTasks: async (projectName: string, projectTasks: NewTask[]) => {
        const response = await api.post(
            "/projects",
            {
                projectName: projectName,
                tasks: projectTasks
            },
            { alert: true }
        );
        return response;
    },

    markLogs: async (toMarkLogIDs: Array<string>, toUnmarkLogIDs: Array<string>) => {
        const response = await api.patch(
            "/logs/edit/marks",
            {
                markLogs: toMarkLogIDs,
                unmarkLogs: toUnmarkLogIDs
            },
            { alert: true }
        );
        return response;
    },

    updateTask: async (updateTask, newLog, toAddUsers, toDelUsers) => {
        const response = await api.put(
            "/tasks",
            {
                updateTask: updateTask,
                newLog: newLog,
                toAddUsers: toAddUsers,
                toDelUsers: toDelUsers
            },
            { alert: true }
        );
        return response;
    },

    // ===============================================================================================================
    // countCustomersPOs: async () => {
    //     const poCountGroupByCustomerID = POs.reduce(
    //         (acc, po) => {
    //             const key = po.customerID;
    //             acc[key] = (acc[key] || 0) + 1;
    //             return acc;
    //         }, {}
    //     );
    //
    //     return poCountGroupByCustomerID;
    // },
    // countInCompleteCustomersPOs: async () => {
    //     throw new Error("NOT IMPLEMENTED");
    //
    //     const poCountGroupByCustomerID = POs.reduce(
    //         (acc, po) => {
    //             if (po.poStatusID)
    //                 // const key = po.customerID;
    //                 acc[key] = (acc[key] || 0) + 1;
    //             return acc;
    //         }, {}
    //     );
    //
    //     return poCountGroupByCustomerID;
    // },

    // getAllPoStatuses: async () => {
    //     return [...PO_STATUSES]
    // },
    // getAllCustomers: async () => {
    //     return [...CUSTOMERS];
    // },
    // getAllCustomersDetailed: async (): Promise<DetailedCustomer[]> => {
    //     const customers = [...CUSTOMERS];
    //
    //     let customersJoinCustomerType = leftJoinOne2One(customers, CUSTOMER_TYPES, "customerTypeID", "customerTypeID", "customerType");
    //
    //     return customersJoinCustomerType;
    // },
    // getAllPOs: async () => {
    //     return [...POs];
    // },
    // getAllPOsDetailed: async (): Promise<DetailedPO[]> => {
    //     const pos = [...POs];
    //
    //     const posJoinCustomer = leftJoinOne2One(pos, CUSTOMERS, "customerID", "customerID", "customer");
    //     const posJoinPoStatus = leftJoinOne2One(posJoinCustomer, PO_STATUSES, "poStatusID", "poStatusID", "poStatus");
    //
    //     return posJoinPoStatus;
    // },
    // getPOandCustomerDetailByTaskID: async (taskID: string) => { // TODO: type this shit
    //     const po = POs.filter(x => x.taskID === taskID);
    //
    //     const poJoinCustomer = leftJoinOne2One(po, CUSTOMERS, "customerID", "customerID", "customer");
    //     // WARNING: assume that this will have 1 only object cuz im bodging this sheeshhhhhhhhhhhhh
    //     console.log("kuy");
    //     console.log(poJoinCustomer);
    //     return poJoinCustomer[0];
    // },
}

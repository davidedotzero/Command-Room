// TODO: DELETE MOCKUP DATA

import type { EditLog, PoStatus, Project, Role, Task, TaskName, TaskStatus, Team } from "./types";

export let TEAMS: Team[] = [
    { teamID: 1, teamName: "PRODUCTION" },
    { teamID: 2, teamName: "DEALER" },
    { teamID: 3, teamName: "OWO" },
]

export let ROLES: Role[] = [
    { roleID: 1, teamID: 1, roleName: "PROD_TUDTOR" },
    { roleID: 2, teamID: 1, roleName: "PROD_GRAPHIC" },
    { roleID: 3, teamID: 2, roleName: "DEALER_1" },
    { roleID: 4, teamID: 2, roleName: "DEALER_2" },
    { roleID: 5, teamID: 3, roleName: "OWO_1" },
    { roleID: 6, teamID: 3, roleName: "OWO_2" },
]

export let TASK_NAMES: TaskName[] = [
    { taskNameID: 1, taskNameStr: "default-task-1" },
    { taskNameID: 2, taskNameStr: "default-task-2" },
    { taskNameID: 3, taskNameStr: "default-task-3" },
    { taskNameID: 4, taskNameStr: "default-task-4" },
    { taskNameID: 5, taskNameStr: "default-task-5" },
    { taskNameID: 6, taskNameStr: "default-task-6" },
    { taskNameID: 7, taskNameStr: "default-task-7" },
    { taskNameID: 8, taskNameStr: "default-task-8" },
]

export let TASK_STATUSES: TaskStatus[] = [
    { statusID: 1, statusName: "In Progress" },
    { statusID: 2, statusName: "Done" },
    { statusID: 3, statusName: "Help Me" },
    // { statusID: 4, statusName: "Cancelled" },
];

// TODO: content TBD
export let PO_STATUSES: PoStatus[] = [
    { poStatusID: 1, poStatusName: "open po" },
    { poStatusID: 2, poStatusName: "dealing" },
    { poStatusID: 3, poStatusName: "closed" },
    { poStatusID: 4, poStatusName: "failed" },
    { poStatusID: 5, poStatusName: "backlog" },
];


// TODO: add preview log field
// TODO: move teamID to many-2-many model 
export let TASKS: Task[] = [
    { taskID: "TASK-0001", projectID: "PROJ-CRM-0007", taskNameID: 5, teamID: 3, deadline: new Date("2025-12-11"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "002-PLACEHOLDER" },
    { taskID: "TASK-0002", projectID: "PROJ-CRM-0002", taskNameID: 8, teamID: 1, deadline: new Date("2025-11-25"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "003-PLACEHOLDER" },
    { taskID: "TASK-0003", projectID: "PROJ-CRM-0009", taskNameID: 7, teamID: 2, deadline: new Date("2025-10-30"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "004-PLACEHOLDER" },
    { taskID: "TASK-0004", projectID: "PROJ-CRM-0001", taskNameID: 6, teamID: 3, deadline: new Date("2025-12-05"), statusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-12-12"), logPreview: "005-PLACEHOLDER" },
    { taskID: "TASK-0005", projectID: "PROJ-CRM-0005", taskNameID: 2, teamID: 1, deadline: new Date("2025-11-18"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "006-PLACEHOLDER" },
    { taskID: "TASK-0006", projectID: "PROJ-CRM-0010", taskNameID: 1, teamID: 2, deadline: new Date("2025-10-15"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "007-PLACEHOLDER" },
    { taskID: "TASK-0007", projectID: "PROJ-CRM-0003", taskNameID: 3, teamID: 3, deadline: new Date("2025-12-22"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "008-PLACEHOLDER" },
    { taskID: "TASK-0008", projectID: "PROJ-CRM-0008", taskNameID: 4, teamID: 1, deadline: new Date("2025-11-02"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "009-PLACEHOLDER" },
    { taskID: "TASK-0009", projectID: "PROJ-CRM-0004", taskNameID: 5, teamID: 2, deadline: new Date("2025-10-21"), statusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "010-PLACEHOLDER" },
    { taskID: "TASK-0010", projectID: "PROJ-CRM-0006", taskNameID: 8, teamID: 3, deadline: new Date("2025-12-14"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "011-PLACEHOLDER" },
    { taskID: "TASK-0011", projectID: "PROJ-CRM-0001", taskNameID: 7, teamID: 1, deadline: new Date("2025-11-09"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "012-PLACEHOLDER" },
    { taskID: "TASK-0012", projectID: "PROJ-CRM-0007", taskNameID: 6, teamID: 2, deadline: new Date("2025-10-28"), statusID: 3, teamHelpID: 3, helpReqAt: new Date("2025-10-5"), logPreview: "013-PLACEHOLDER" },
    { taskID: "TASK-0013", projectID: "PROJ-CRM-0002", taskNameID: 2, teamID: 3, deadline: new Date("2025-12-01"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "014-PLACEHOLDER" },
    { taskID: "TASK-0014", projectID: "PROJ-CRM-0009", taskNameID: 1, teamID: 1, deadline: new Date("2025-11-15"), statusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-01-01"), logPreview: "015-PLACEHOLDER" },
    { taskID: "TASK-0015", projectID: "PROJ-CRM-0005", taskNameID: 3, teamID: 2, deadline: new Date("2025-10-08"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "016-PLACEHOLDER" },
    { taskID: "TASK-0016", projectID: "PROJ-CRM-0010", taskNameID: 4, teamID: 3, deadline: new Date("2025-12-28"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "017-PLACEHOLDER" },
    { taskID: "TASK-0017", projectID: "PROJ-CRM-0003", taskNameID: 5, teamID: 1, deadline: new Date("2025-11-20"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "018-PLACEHOLDER" },
    { taskID: "TASK-0018", projectID: "PROJ-CRM-0008", taskNameID: 8, teamID: 2, deadline: new Date("2025-10-12"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "019-PLACEHOLDER" },
    { taskID: "TASK-0019", projectID: "PROJ-CRM-0004", taskNameID: 7, teamID: 3, deadline: new Date("2025-12-08"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "020-PLACEHOLDER" },
    { taskID: "TASK-0020", projectID: "PROJ-CRM-420", taskNameID: 6, teamID: 1, deadline: new Date("2024-01-01"), statusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "021-PLACEHOLDER" },
    { taskID: "TASK-0021", projectID: "PROJ-CRM-0001", taskNameID: 2, teamID: 2, deadline: new Date("2025-10-19"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "022-PLACEHOLDER" },
    { taskID: "TASK-0022", projectID: "PROJ-CRM-0007", taskNameID: 1, teamID: 3, deadline: new Date("2025-12-18"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "023-PLACEHOLDER" },
    { taskID: "TASK-0023", projectID: "PROJ-CRM-0002", taskNameID: 3, teamID: 1, deadline: new Date("2025-11-05"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "024-PLACEHOLDER" },
    { taskID: "TASK-0024", projectID: "PROJ-CRM-0009", taskNameID: 4, teamID: 2, deadline: new Date("2025-10-25"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "025-PLACEHOLDER" },
    { taskID: "TASK-0025", projectID: "PROJ-CRM-0005", taskNameID: 5, teamID: 3, deadline: new Date("2025-12-03"), statusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-01-01"), logPreview: "026-PLACEHOLDER" },
    { taskID: "TASK-0026", projectID: "PROJ-CRM-0010", taskNameID: 8, teamID: 1, deadline: new Date("2025-11-12"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "027-PLACEHOLDER" },
    { taskID: "TASK-0027", projectID: "PROJ-CRM-0003", taskNameID: 7, teamID: 2, deadline: new Date("2025-10-05"), statusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "028-PLACEHOLDER" },
    { taskID: "TASK-0028", projectID: "PROJ-CRM-0008", taskNameID: 6, teamID: 3, deadline: new Date("2025-12-25"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "029-PLACEHOLDER" },
    { taskID: "TASK-0029", projectID: "PROJ-CRM-0004", taskNameID: 2, teamID: 1, deadline: new Date("2025-11-22"), statusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "030-PLACEHOLDER" },
    { taskID: "TASK-0030", projectID: "PROJ-CRM-0006", taskNameID: 1, teamID: 2, deadline: new Date("2025-10-17"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "031-PLACEHOLDER" },
    { taskID: "TASK-0031", projectID: "PROJ-CRM-0007", taskNameID: 6, teamID: 2, deadline: new Date("2025-10-28"), statusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "032-PLACEHOLDER" },
];

// TODO: DELETE MOCKUP DATA
export let PROJECTS: Project[] = [
    { projectID: "PROJ-CRM-0001", projectName: "test1", done: false },
    { projectID: "PROJ-CRM-0002", projectName: "test2", done: false },
    { projectID: "PROJ-CRM-0003", projectName: "test3", done: false },
    { projectID: "PROJ-CRM-0004", projectName: "test4", done: false },
    { projectID: "PROJ-CRM-0005", projectName: "test5", done: false },
    { projectID: "PROJ-CRM-0006", projectName: "test6", done: false },
    { projectID: "PROJ-CRM-0007", projectName: "test7", done: false },
    { projectID: "PROJ-CRM-0008", projectName: "test8", done: false },
    { projectID: "PROJ-CRM-0009", projectName: "test9", done: false },
    { projectID: "PROJ-CRM-0010", projectName: "test10", done: false },
    { projectID: "PROJ-CRM-0011", projectName: "test11", done: true },
    { projectID: "PROJ-CRM-0012", projectName: "test12", done: false },
    { projectID: "PROJ-CRM-0013", projectName: "test13", done: true },
];

export let EDIT_LOGS: EditLog[] = [
    { eLogID: "LOG-2025-09-29-00001", taskID: "TASK-0012", userID: "USR-00001", date: new Date("2025-09-29"), reason: "eieieieieieieiieieiei", fromStatusID: null, toStatusID: null, fromDeadline: new Date("2025-08-18"), toDeadline: new Date("2025-09-29") },
    { eLogID: "LOG-2025-09-29-00002", taskID: "TASK-0012", userID: "USR-00001", date: new Date("2025-09-29"), reason: "eieieieieieieiieieiei", fromStatusID: 1, toStatusID: 2, fromDeadline: null, toDeadline: null },
];

/**
 * Performs a one-to-many left join on two arrays of objects.
 * @param {object} options - The join configuration.
 * @param {object[]} options.leftArray - The primary array (e.g., users).
 * @param {object[]} options.rightArray - The array to join from (e.g., posts).
 * @param {string} options.leftKey - The name of the key in the left array's objects.
 * @param {string} options.rightKey - The name of the key in the right array's objects.
 * @param {string} options.newPropName - The name for the new property that will hold the matched items.
 * @returns {object[]} A new array with the joined data.
 */
// TODO: make this sheesh typescript
// TODO: make this join just the field we want instead of the whole object
// TODO: make this extension function of Object[] or abstact this to other file
export function leftJoinOne2One(leftArray, rightArray, leftKey, rightKey, newPropName) {
    return leftArray.map(leftItem => {
        // For each item on the left, find all matching items on the right
        const matches = rightArray.find(rightItem =>
            leftItem[leftKey] === rightItem[rightKey]
        );

        // Return the original left item, plus the new property with the matched items
        return {
            ...leftItem,
            [newPropName]: matches,
        };
    });
}

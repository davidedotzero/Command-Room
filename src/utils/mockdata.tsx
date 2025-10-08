// TODO: DELETE MOCKUP DATA

import type { Customer, CustomerType, DefaultTaskName, EditLog, PO, PoStatus, Project, Task, TaskStatus, TaskUser, Team, User } from "./types";


export let TEAMS: Team[] = [
    { teamID: 1, teamName: "PRODUCTION" },
    { teamID: 2, teamName: "DEALER" },
    { teamID: 3, teamName: "OWO" },
]

export let TASK_STATUSES: TaskStatus[] = [
    { taskStatusID: 1, taskStatusName: "In Progress" },
    { taskStatusID: 2, taskStatusName: "Done" },
    { taskStatusID: 3, taskStatusName: "Help Me" },
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

// WARNING: this is only used for mocking 1TaskManyUsers functionality
export let USERS: User[] = [
    { userID: "USR-00001", userName: "lnwjuanza", email: "lnwjuanza007.2535@gmail.com", roleID: 1, isAdmin: true },
    { userID: "USR-00002", userName: "pchampkaaa", email: "pchamplovelove@gmail.com", roleID: 2, isAdmin: true },
    { userID: "USR-00003", userName: "OWO", email: "musicarmscreative@gmail.com", roleID: 1, isAdmin: true },
    { userID: "USR-00004", userName: "UWU", email: "larron959@gmail.com", roleID: 1, isAdmin: true },
    // USER-2025-000000
];

export let CUSTOMER_TYPES: CustomerType[] = [
    { customerTypeID: 1, customerTypeName: "ประเภทที่ 1" },
    { customerTypeID: 2, customerTypeName: "ประเภทที่ 2" },
    { customerTypeID: 3, customerTypeName: "ประเภทที่ 3" },
]

export let CUSTOMERS: Customer[] = [
    { customerID: "CUS-2025-000001", customerName: "luk ka #1", address: "addr #1", customerTypeID: 1 },
    { customerID: "CUS-2025-000002", customerName: "luk ka #2", address: "addr #2", customerTypeID: 2 },
    { customerID: "CUS-2025-000003", customerName: "luk ka #3", address: "addr #3", customerTypeID: 3 },
    { customerID: "CUS-2025-000004", customerName: "luk ka #4", address: "addr #4", customerTypeID: 1 },
    { customerID: "CUS-2025-000005", customerName: "luk ka #5", address: "addr #5", customerTypeID: 2 },
    { customerID: "CUS-2025-000006", customerName: "luk ka #6", address: "addr #6", customerTypeID: 3 },
    { customerID: "CUS-2025-000007", customerName: "luk ka #7", address: "addr #7", customerTypeID: 1 },
    { customerID: "CUS-2025-000008", customerName: "luk ka #8", address: "addr #8", customerTypeID: 2 },
    { customerID: "CUS-2025-000009", customerName: "luk ka #9", address: "addr #9", customerTypeID: 3 },
    { customerID: "CUS-2025-000010", customerName: "luk ka #10", address: "addr #10", customerTypeID: 1 },
];

export let POs: PO[] = [
    { poID: "PO-20251006-000001", customerID: "CUS-2025-000001", taskID: "TASK-20250903-000003", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000002", customerID: "CUS-2025-000002", taskID: "TASK-20250906-000006", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000003", customerID: "CUS-2025-000003", taskID: "TASK-20250909-000009", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
    { poID: "PO-20251006-000004", customerID: "CUS-2025-000002", taskID: "TASK-20250912-000012", poStatusID: 1, createAt: new Date(2025, 9, 6), poAttachmentID: null },
];

export let TASK_USER: TaskUser[] = [
    { taskID: "TASK-20250912-000012", userID: "USR-00002" },
    { taskID: "TASK-20250913-000013", userID: "USR-00002" },
    { taskID: "TASK-20250914-000014", userID: "USR-00002" },
    { taskID: "TASK-20250915-000015", userID: "USR-00002" },
    { taskID: "TASK-20250916-000016", userID: "USR-00002" },
    { taskID: "TASK-20250917-000017", userID: "USR-00002" },
    { taskID: "TASK-20250918-000018", userID: "USR-00002" },
    { taskID: "TASK-20250919-000019", userID: "USR-00002" },
    { taskID: "TASK-20250916-000016", userID: "USR-00003" },
    { taskID: "TASK-20250917-000017", userID: "USR-00003" },
    { taskID: "TASK-20250918-000018", userID: "USR-00003" },
    { taskID: "TASK-20250919-000019", userID: "USR-00003" },
    { taskID: "TASK-20250912-000012", userID: "USR-00003" },
];


// TODO: move teamID to many-2-many model 
export let TASKS: Task[] = [
    { taskID: "TASK-20250901-000001", projectID: "PROJ-CRM-0007", taskName: "default-task-5", teamID: 3, deadline: new Date("2025-12-11"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "002-PLACEHOLDER", createdAt: new Date("2025-09-01"), helpReqReason: null },
    { taskID: "TASK-20250902-000002", projectID: "PROJ-CRM-0002", taskName: "default-task-8", teamID: 1, deadline: new Date("2025-11-25"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "003-PLACEHOLDER", createdAt: new Date("2025-09-02"), helpReqReason: null },
    { taskID: "TASK-20250903-000003", projectID: "PROJ-CRM-0009", taskName: "default-task-7", teamID: 2, deadline: new Date("2025-10-30"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "004-PLACEHOLDER", createdAt: new Date("2025-09-03"), helpReqReason: null },
    { taskID: "TASK-20250904-000004", projectID: "PROJ-CRM-0001", taskName: "default-task-6", teamID: 3, deadline: new Date("2025-12-05"), taskStatusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-12-12"), logPreview: "005-PLACEHOLDER", createdAt: new Date("2025-09-04"), helpReqReason: null },
    { taskID: "TASK-20250905-000005", projectID: "PROJ-CRM-0005", taskName: "default-task-2", teamID: 1, deadline: new Date("2025-11-18"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "006-PLACEHOLDER", createdAt: new Date("2025-09-05"), helpReqReason: null },
    { taskID: "TASK-20250906-000006", projectID: "PROJ-CRM-0010", taskName: "default-task-1", teamID: 2, deadline: new Date("2025-10-15"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "007-PLACEHOLDER", createdAt: new Date("2025-09-06"), helpReqReason: null },
    { taskID: "TASK-20250907-000007", projectID: "PROJ-CRM-0003", taskName: "default-task-3", teamID: 3, deadline: new Date("2025-12-22"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "008-PLACEHOLDER", createdAt: new Date("2025-09-07"), helpReqReason: null },
    { taskID: "TASK-20250908-000008", projectID: "PROJ-CRM-0008", taskName: "default-task-4", teamID: 1, deadline: new Date("2025-11-02"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "009-PLACEHOLDER", createdAt: new Date("2025-09-08"), helpReqReason: null },
    { taskID: "TASK-20250909-000009", projectID: "PROJ-CRM-0004", taskName: "default-task-5", teamID: 2, deadline: new Date("2025-10-21"), taskStatusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "010-PLACEHOLDER", createdAt: new Date("2025-09-09"), helpReqReason: null },
    { taskID: "TASK-20250910-000010", projectID: "PROJ-CRM-0006", taskName: "default-task-8", teamID: 3, deadline: new Date("2025-12-14"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "011-PLACEHOLDER", createdAt: new Date("2025-09-10"), helpReqReason: null },
    { taskID: "TASK-20250911-000011", projectID: "PROJ-CRM-0001", taskName: "default-task-7", teamID: 1, deadline: new Date("2025-11-09"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "012-PLACEHOLDER", createdAt: new Date("2025-09-11"), helpReqReason: null },
    { taskID: "TASK-20250912-000012", projectID: "PROJ-CRM-0007", taskName: "default-task-6", teamID: 2, deadline: new Date("2025-10-28"), taskStatusID: 3, teamHelpID: 3, helpReqAt: new Date("2025-10-5"), logPreview: "013-PLACEHOLDER", createdAt: new Date("2025-09-12"), helpReqReason: null },
    { taskID: "TASK-20250913-000013", projectID: "PROJ-CRM-0002", taskName: "default-task-2", teamID: 3, deadline: new Date("2025-12-01"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "014-PLACEHOLDER", createdAt: new Date("2025-09-13"), helpReqReason: null },
    { taskID: "TASK-20250914-000014", projectID: "PROJ-CRM-0009", taskName: "default-task-1", teamID: 1, deadline: new Date("2025-11-15"), taskStatusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-01-01"), logPreview: "015-PLACEHOLDER", createdAt: new Date("2025-09-14"), helpReqReason: null },
    { taskID: "TASK-20250915-000015", projectID: "PROJ-CRM-0005", taskName: "default-task-3", teamID: 2, deadline: new Date("2025-10-08"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "016-PLACEHOLDER", createdAt: new Date("2025-09-15"), helpReqReason: null },
    { taskID: "TASK-20250916-000016", projectID: "PROJ-CRM-0010", taskName: "default-task-4", teamID: 3, deadline: new Date("2025-12-28"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "017-PLACEHOLDER", createdAt: new Date("2025-09-16"), helpReqReason: null },
    { taskID: "TASK-20250917-000017", projectID: "PROJ-CRM-0003", taskName: "default-task-5", teamID: 1, deadline: new Date("2025-11-20"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "018-PLACEHOLDER", createdAt: new Date("2025-09-17"), helpReqReason: null },
    { taskID: "TASK-20250918-000018", projectID: "PROJ-CRM-0008", taskName: "default-task-8", teamID: 2, deadline: new Date("2025-10-12"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "019-PLACEHOLDER", createdAt: new Date("2025-09-18"), helpReqReason: null },
    { taskID: "TASK-20250919-000019", projectID: "PROJ-CRM-0004", taskName: "default-task-7", teamID: 3, deadline: new Date("2025-12-08"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "020-PLACEHOLDER", createdAt: new Date("2025-09-19"), helpReqReason: null },
    { taskID: "TASK-20250920-000020", projectID: "PROJ-CRM-0420", taskName: "default-task-6", teamID: 1, deadline: new Date("2024-01-01"), taskStatusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "021-PLACEHOLDER", createdAt: new Date("2025-09-20"), helpReqReason: null },
    { taskID: "TASK-20250921-000021", projectID: "PROJ-CRM-0001", taskName: "default-task-2", teamID: 2, deadline: new Date("2025-10-19"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "022-PLACEHOLDER", createdAt: new Date("2025-09-21"), helpReqReason: null },
    { taskID: "TASK-20250922-000022", projectID: "PROJ-CRM-0007", taskName: "default-task-1", teamID: 3, deadline: new Date("2025-12-18"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "023-PLACEHOLDER", createdAt: new Date("2025-09-22"), helpReqReason: null },
    { taskID: "TASK-20250923-000023", projectID: "PROJ-CRM-0002", taskName: "default-task-3", teamID: 1, deadline: new Date("2025-11-05"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "024-PLACEHOLDER", createdAt: new Date("2025-09-23"), helpReqReason: null },
    { taskID: "TASK-20250924-000024", projectID: "PROJ-CRM-0009", taskName: "default-task-4", teamID: 2, deadline: new Date("2025-10-25"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "025-PLACEHOLDER", createdAt: new Date("2025-09-24"), helpReqReason: null },
    { taskID: "TASK-20250925-000025", projectID: "PROJ-CRM-0005", taskName: "default-task-5", teamID: 3, deadline: new Date("2025-12-03"), taskStatusID: 3, teamHelpID: 2, helpReqAt: new Date("2024-01-01"), logPreview: "026-PLACEHOLDER", createdAt: new Date("2025-09-25"), helpReqReason: null },
    { taskID: "TASK-20250926-000026", projectID: "PROJ-CRM-0010", taskName: "default-task-8", teamID: 1, deadline: new Date("2025-11-12"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "027-PLACEHOLDER", createdAt: new Date("2025-09-26"), helpReqReason: null },
    { taskID: "TASK-20250927-000027", projectID: "PROJ-CRM-0003", taskName: "default-task-7", teamID: 2, deadline: new Date("2025-10-05"), taskStatusID: 2, teamHelpID: null, helpReqAt: null, logPreview: "028-PLACEHOLDER", createdAt: new Date("2025-09-27"), helpReqReason: null },
    { taskID: "TASK-20250928-000028", projectID: "PROJ-CRM-0008", taskName: "default-task-6", teamID: 3, deadline: new Date("2025-12-25"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "029-PLACEHOLDER", createdAt: new Date("2025-09-28"), helpReqReason: null },
    { taskID: "TASK-20250929-000029", projectID: "PROJ-CRM-0004", taskName: "default-task-2", teamID: 1, deadline: new Date("2025-11-22"), taskStatusID: 3, teamHelpID: 3, helpReqAt: new Date("2024-01-01"), logPreview: "030-PLACEHOLDER", createdAt: new Date("2025-09-29"), helpReqReason: null },
    { taskID: "TASK-20250930-000030", projectID: "PROJ-CRM-0006", taskName: "default-task-1", teamID: 2, deadline: new Date("2025-10-17"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "031-PLACEHOLDER", createdAt: new Date("2025-09-30"), helpReqReason: null },
    { taskID: "TASK-20251001-000031", projectID: "PROJ-CRM-0007", taskName: "default-task-6", teamID: 2, deadline: new Date("2025-10-28"), taskStatusID: 1, teamHelpID: null, helpReqAt: null, logPreview: "032-PLACEHOLDER", createdAt: new Date("2025-10-01"), helpReqReason: null },
];

// TODO: DELETE MOCKUP DATA
export let PROJECTS: Project[] = [
    { projectID: "PROJ-CRM-0001", projectName: "test1", isArchived: false },
    { projectID: "PROJ-CRM-0002", projectName: "test2", isArchived: false },
    { projectID: "PROJ-CRM-0003", projectName: "test3", isArchived: false },
    { projectID: "PROJ-CRM-0004", projectName: "test4", isArchived: false },
    { projectID: "PROJ-CRM-0005", projectName: "test5", isArchived: false },
    { projectID: "PROJ-CRM-0006", projectName: "test6", isArchived: false },
    { projectID: "PROJ-CRM-0007", projectName: "test7", isArchived: false },
    { projectID: "PROJ-CRM-0008", projectName: "test8", isArchived: false },
    { projectID: "PROJ-CRM-0009", projectName: "test9", isArchived: false },
    { projectID: "PROJ-CRM-0010", projectName: "test10", isArchived: false },
    { projectID: "PROJ-CRM-0011", projectName: "test11", isArchived: true },
    { projectID: "PROJ-CRM-0012", projectName: "test12", isArchived: false },
    { projectID: "PROJ-CRM-0013", projectName: "test13", isArchived: true },
    // proj-2025-000000
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

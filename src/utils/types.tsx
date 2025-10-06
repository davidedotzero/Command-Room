// TODO: make all this sheesh match database schema

// TODO: make this id+name ????

// TODO: will change this when i know what fields are supposed to be in projectTask
// TODO: add preview log field
export interface Task {
    taskID: string,
    projectID: string,
    taskName: string,
    teamID: number, //Team: teamID
    deadline: Date,
    statusID: number, //TaskStatus: statusID
    logPreview: string // this should be the "description" of the latest log for the task
    teamHelpID: number | null, //Team: teamID
    helpReqAt: Date | null,
    helpReqReason: string | null,
    createdAt: Date
};

export interface Project {
    projectID: string;
    projectName: string;
    isArchived: boolean;
}

export interface Team {
    teamID: number,
    teamName: string,
}

export interface Role {
    roleID: number,
    teamID: number,
    roleName: string,
}

export interface TaskStatus {
    statusID: number,
    statusName: string,
}

export interface PoStatus {
    poStatusID: number,
    poStatusName: string,
}

export interface User {
    userID: string;
    name: string;
    email: string;
    roleID: number;
    isAdmin: boolean;
}

export interface EditLog {
    eLogID: string;
    taskID: string; // Task: taskID
    userID: string; // UseR: userID
    date: Date;
    reason: string;
    fromStatusID: number | null;
    toStatusID: number | null;
    fromDeadline: Date | null;
    toDeadline: Date | null;
}

// Task[] after joining with necessary tables
export interface FilteringTask extends Task {
    team: Team;
    status: TaskStatus;
    teamHelp: Team;
    workers: User[];
}

export interface DetailedCustomer extends Customer {
    customerType: CustomerType;
}

export interface DetailedPO extends PO {
    poStatus: POStatus;
    customer: Customer;
}

export interface DefaultTaskName {
    taskName: string;
    teamID: number;
}

export interface TaskUser {
    taskID: string;
    userID: string;
}

export interface Customer {
    customerID: string;
    customerName: string;
    address: string;
    customerTypeID: number;
}

export interface CustomerType {
    customerTypeID: number;
    customerTypeName: string;
}

export interface PO {
    poID: string;
    customerID: string;
    taskID: string;
    poStatusID: number;
    poAttachmentID: string | null;
    createAt: Date;
}

export interface POStatus {
    poStatusID: number;
    poStatusName: string;
}

export interface CustomerUser {
    customerID: string;
    userID: string;
}

export interface Attachment {
    attachmentID: string;
    attachmentTypeID: number;
    link: string;
}

export interface AttachmentType {
    attachmentTypeID: number;
    attachmentTypeName: number;
}

// format PREFIX-YYYYMMDD-XXXXXX
// PROJ-20251001-000001
// TASK-20251001-000001
export interface MaxIDS {
    task: number;
}

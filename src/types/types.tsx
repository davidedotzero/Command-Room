// TODO: make all this sheesh match database schema

export const NotificationType = {
    GENERIC: 1,
    PROJ_NEW: 2,
    PROJ_EDIT_NAME: 3,
    PROJ_DELETE: 4,
    TASK_UPDATE_DEADLINE: 5,
    TASK_UPDATE_STATUS: 6,
    TASK_UPDATE_GENERIC: 7,
    TASK_UPDATE_HELPREQ: 8,
    TASK_NEW: 9,
    TASK_DELETE: 10,
};
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const TaskStatusID = {
    IN_PROGRESS: 1,
    DONE: 2,
    HELP_ME: 3
};
export type TaskStatusID = typeof TaskStatusID[keyof typeof TaskStatusID];

// for adding new task on creating project in frontend 
export interface NewTask {
    id: number, // temporary id for frontends 
    taskName: string,
    team: Team,
    deadline: Date,
    deleting?: boolean
};

// DB types =================================
export interface Task {
    taskID: string,
    projectID: string,
    taskName: string,
    teamID: number, //Team: teamID
    deadline: Date,
    taskStatusID: number, //TaskStatus: statusID
    logPreview: string // this should be the "description" of the latest log for the task
    teamHelpID: number | null, //Team: teamID
    helpReqAt: Date | null,
    helpReqReason: string | null,
    createdAt: Date,
    updatedAt: Date | null,
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

export interface TaskStatus {
    taskStatusID: number,
    taskStatusName: string,
}

export interface PoStatus {
    poStatusID: number,
    poStatusName: string,
}

export interface User {
    userID: string;
    userName: string;
    email: string;
    teamID: number;
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
    markedDone: boolean;
}

export interface EditLogDetailed extends EditLog {
    userName: string | null;
}

// Task[] after joining with necessary tables
export interface FilteringTask extends Task {
    teamName: string; // Team: teamName
    taskStatusName: string; // TaskStatus: taskStatusName
    teamHelpName: string;
    workers: User[];
    po: PO | null;
    customer: Customer | null;
    projectName: string;
    recentLogsCount: number;
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
    ID: integer;  //ID ของลูกค้า
    CustomerName: char 150;  // ชื่อลูกค้า เช่น สมชาย
    CusotmerCode: char 50;  //รหัสลูกค้า
    ContactName: char 100;  // ชื่อผู้ติดต่อ เช่น บอย
    RDBranchName: char 150;  // ชื่อสาขาตามกรมสรรพากร
    FullAddress: char 300;  //ที่อยู่ลูกค้า เช่น 11 / 2 ถ.พหลโยธิน ต.คูคต อ.ลำลูกา จ.ปทุมธานี 12130
    Mobile: char 50;  //เบอร์โทรลูกค้า เช่น 0891234567
    TaxCode: char 20;  //เลขผู้เสียภาษี เช่น 1234567890123
    PriceType: integer;  //ช่องราคาขาย มีได้ 5 ช่องคือ 1, 2, 3, 4, 5
    CreditDay: integer;  //จำนวนวันที่ให้เครดิตลูกค้า
    Point: decimal;  //แต้มคงเหลือ
    MemberLevel: integer;  //ระดับสมาชิก(0 = ไม่ได้เป็นสมาชิก)
    Status: integer;  //สถานะ(0 = ไม่ได้ใช้แล้ว, 1 = ใช้อยู่)
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

export interface NotificationDetailed {
    notificationID: number;
    seen: boolean;
    visited: boolean;
    senderID: string;
    senderName: string;
    senderEmail: string;
    senderTeamID: number;
    senderTeamName: string;
    receiverID: string;
    receiverName: string;
    notificationTypeID: number;
    message: string;
    linkTargetID: string | null;
    createdAt: Date;
}

// format PREFIX-YYYYMMDD-XXXXXX
// PROJ-20251001-000001
// TASK-20251001-000001
export interface MaxIDS {
    task: number;
}

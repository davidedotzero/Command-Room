// TODO: make all this sheesh match database schema

// TODO: make this id+name ????
type POStatus = "PLACEHOLDER" | "PLACEHOLDER2";

// TODO: will change this when i know what fields are supposed to be in projectTask
// TODO: add preview log field
export interface Task {
    taskID: string,
    projectID: string,
    taskNameID: number, //TaskName: taskNameID (should be number)
    teamID: number, //Team: teamID
    deadline: Date,
    statusID: number, //TaskStatus: statusID
    logPreview: string // this should be the "description" of the latest log for the task
};

export interface TaskName {
    taskNameID: number,
    taskNameStr: string
}

export interface Team {
    teamID: number,
    teamName: string,
}

export interface TaskStatus {
    statusID: number,
    statusName: string,
}



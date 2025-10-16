import { useEffect, useState } from "react";
import { StatusColor } from "../../../utils/constants";
import { calculateLeadTime, formatDateYYYY_MM_DD } from "../../../utils/functions";
import { DetailItem } from "../forms/FormItems";
import type { FilteringTask } from "../../../utils/types";
import { API } from "../../../utils/api";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import AssigneeLabels from "../../utils/AssigneeLabels";

// TODO: types for selectedTask
function TaskDetailsView({ task, currentProjectName }: { task: FilteringTask, currentProjectName: string }) {
    const currentTask = task;
    const helpLeadTime = currentTask.helpReqAt === null ? 0 : calculateLeadTime(new Date(currentTask.deadline), new Date(currentTask.helpReqAt));

    const [taskLogs, setTaskLogs] = useState("Loading...");

    const { TASK_STATUSES } = useDbConst();

    useEffect(() => {
        fetchData(currentTask.taskID);
    }, [])

    const fetchData = async (taskID: string) => {
        const response = await API.getLogsByTaskIdDesc(currentTask.taskID);
        let displayLog = "";
        if (!response || response.length <= 0) {
            displayLog = "-";
            setTaskLogs(displayLog);
            return;
        }

        for (let log of response) {
            console.log(log.date);
            displayLog += `--- อัปเดตเมื่อ ${log.date.toLocaleString("en-CA", { timeZone: "Asia/Bangkok", hour12: false })} ---\n`
            if (log.fromDeadline && log.toDeadline) displayLog += `* เปลี่ยน Deadline: ${formatDateYYYY_MM_DD(log.fromDeadline!)} -> ${formatDateYYYY_MM_DD(log.toDeadline)
                } \"\n`
            if (log.fromStatusID && log.toStatusID) displayLog += `* เปลี่ยน Status: ${TASK_STATUSES.find(t => t.taskStatusID === log.fromStatusID)?.taskStatusName} -> ${TASK_STATUSES.find(t => t.taskStatusID === log.toStatusID)?.taskStatusName}\n`
            displayLog += `รายละเอียด / เหตุผล: ${log.reason}\n`
            displayLog += '---------------------------\n\n'
        }
        setTaskLogs(displayLog);
    };

    return (
        <>
            {/* // TODO: abstract this to separate components */}
            <div className="p-8 space-y-8">
                {/* === Section: รายละเอียดหลัก === */}
                <div className="pb-6 border-b">
                    <div className="md:col-span-2 mb-6">
                        <DetailItem label="Task">
                            <p className="text-xl font-bold text-gray-800">{currentTask.taskName || "-"}</p>
                            <strong>ของ Project:</strong>
                            <p>{currentProjectName}</p>
                        </DetailItem>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Team">
                            <span className="px-2.5 py-1 text-sm font-semibold text-orange-800 bg-orange-100 rounded-full">
                                {currentTask.teamName}
                            </span>
                        </DetailItem>

                        <DetailItem label="Status">
                            <p className={`font-bold text-base ${StatusColor.get(currentTask.taskStatusName) || "text-gray-500"}`}>
                                {currentTask.taskStatusName}
                            </p>
                        </DetailItem>

                        <DetailItem label="Deadline">
                            <p className="text-base">
                                {formatDateYYYY_MM_DD(new Date(currentTask.deadline))}
                            </p>
                        </DetailItem>

                        <DetailItem label="Workers">
                            {/* // TODO: fetch this properly later */}
                            {
                                task.workers === null ? "-" : task.workers.map(x => { return <AssigneeLabels key={x.userID} text={x.userName} /> })
                            }
                        </DetailItem>
                    </div>
                </div>

                {/* // TODO: abstract this to separate component */}
                {currentTask.taskStatusName === "Help Me" && ( // TODO: compare by ID
                    <div className="pb-6 border-b">
                        <div className="p-5 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                            <h4 className="text-md font-bold text-purple-800 mb-4">
                                รายละเอียดการร้องขอความช่วยเหลือ
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                                <DetailItem label="วันที่ร้องขอ">
                                    <p className="font-semibold">
                                        {currentTask.helpReqAt === null ? "-" : formatDateYYYY_MM_DD(new Date(currentTask.helpReqAt))}
                                    </p>
                                </DetailItem>
                                <DetailItem label="ขอความช่วยเหลือจาก">
                                    <span className="px-2.5 py-1 text-sm font-semibold text-purple-800 bg-purple-200 rounded-full">
                                        {currentTask.teamHelpName}
                                    </span>
                                </DetailItem>
                                <DetailItem label="ขอความช่วยเหลือล่วงหน้า">
                                    <p className="font-bold text-purple-800">{helpLeadTime} วัน</p>
                                </DetailItem>
                                <div className="md:col-span-3">
                                    <DetailItem label="รายละเอียด">
                                        <p className="p-3 bg-purple-100 rounded-md border border-purple-200 min-h-[50px] whitespace-pre-wrap">
                                            {/* // TODO: fetch latest help log or all log? */}
                                            {task.helpReqReason || "-"}
                                        </p>
                                    </DetailItem>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-y-6">
                    <DetailItem label="Notes / Result (Log)">
                        <p className="p-3 bg-gray-50 rounded-md border min-h-[100px] max-h-[300px] whitespace-pre-wrap disabled overflow-y-scroll">
                            {/* // TODO: fetch this properly later */}
                            {taskLogs}
                        </p>
                    </DetailItem>
                </div>
            </div >
        </>
    );
};

export default TaskDetailsView;

import { StatusColor } from "../../../utils/constants";
import { calculateLeadTime, formatDateYYYY_MM_DD, formatDateYYYY_MM_DD_HH_MM_SS } from "../../../utils/functions";
import { DetailItem } from "../forms/FormItems";
import type { FilteringTask } from "../../../types/types";
import AssigneeLabels from "../../utils/AssigneeLabels";
import TeamLabel from "../../utils/TeamLabels";

// TODO: types for selectedTask
function TaskDetailsView({ task }: { task: FilteringTask }) {
    const currentTask = task;
    const helpLeadTime = currentTask.helpReqAt === null ? 0 : calculateLeadTime(new Date(currentTask.deadline), new Date(currentTask.helpReqAt));

    return (
        <>
            {/* // TODO: abstract this to separate components */}
            <div className="p-8 space-y-8">
                {/* === Section: รายละเอียดหลัก === */}
                <div className="pb-6 border-b">
                    <div className="md:col-span-2 mb-6">
                        <DetailItem label="">
                            <p className="text-xl font-bold text-gray-800">{currentTask.taskName || "-"}</p>
                            <span className="font-bold">Project - </span>{currentTask.projectName}
                        </DetailItem>
                    </div>
                    <div className="md:col-span-2 mb-6">
                        <span className="text-sm text-gray-500">{"สร้างเมื่อ: "}</span>
                        <span className="text-sm text-grey-900">{currentTask.createdAt == null ? "N/A" : formatDateYYYY_MM_DD_HH_MM_SS(currentTask.createdAt)}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Team">
                            <TeamLabel text={currentTask.teamName} />
                        </DetailItem>

                        <DetailItem label="Status">
                            <p className={`font-bold text-base ${StatusColor.get(currentTask.taskStatusName) || "text-gray-500"}`}>
                                {currentTask.taskStatusName}
                            </p>
                        </DetailItem>

                        <DetailItem label="Deadline">
                            <p className="text-base text-gray-900">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="col-span-1">
                                    <DetailItem label="วันที่ร้องขอ">
                                        <p className="font-semibold">
                                            {currentTask.helpReqAt === null ? "-" : formatDateYYYY_MM_DD(new Date(currentTask.helpReqAt))}
                                        </p>
                                    </DetailItem>
                                </div>

                                <div className="col-span-1">
                                    <DetailItem label="ขอความช่วยเหลือล่วงหน้า">
                                        <p className="font-bold text-purple-800">{helpLeadTime} วัน</p>
                                    </DetailItem>
                                </div>

                                <div className="col-span-2">
                                    <DetailItem label="ขอความช่วยเหลือจาก">
                                        <span className="px-2.5 py-1 text-sm font-semibold text-purple-800 bg-purple-200 rounded-full">
                                            {currentTask.teamHelpName}
                                        </span>
                                    </DetailItem>
                                </div>

                                <div className="md:col-span-2">
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
            </div >
        </>
    );
};

export default TaskDetailsView;

import { StatusColor } from "../../../utils/constants";
import { calculateLeadTime, formatDateYYYY_MM_DD } from "../../../utils/functions";
import { DetailItem } from "../forms/FormItems";

// TODO: types for selectedTask
function TaskDetailsView(props) {
    const currentTask = props.task;
    const helpLeadTime = calculateLeadTime(new Date(currentTask.deadline), new Date(currentTask.helpReqAt));

    return (
        <>
            <div className="p-8 space-y-8">
                {/* === Section: รายละเอียดหลัก === */}
                <div className="pb-6 border-b">
                    <div className="md:col-span-2 mb-6">
                        <DetailItem label="Task">
                            <p className="text-xl font-bold text-gray-800">{currentTask.taskName.taskNameStr || "-"}</p>
                            <strong>ของ Project:</strong>
                            <p>{props.currentProjectName}</p>
                        </DetailItem>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Team">
                            <span className="px-2.5 py-1 text-sm font-semibold text-orange-800 bg-orange-100 rounded-full">
                                {currentTask.team.teamName}
                            </span>
                        </DetailItem>

                        <DetailItem label="Status">
                            <p className={`font-bold text-base ${StatusColor.get(currentTask.status.statusName) || "text-gray-500"}`}>
                                {currentTask.status.statusName}
                            </p>
                        </DetailItem>

                        <DetailItem label="Deadline">
                            <p className="text-base">
                                {formatDateYYYY_MM_DD(new Date(currentTask.deadline))}
                            </p>
                        </DetailItem>

                        <DetailItem label="Poo patibud">
                            <p className="text-base">
                                {/* // TODO: fetch this properly later */}
                                {"-"}
                            </p>
                        </DetailItem>
                    </div>
                </div>

                {/* // TODO: abstract this to separate component */}
                {currentTask.status.statusName === "Help Me" && ( // TODO: compare by ID
                    <div className="pb-6 border-b">
                        <div className="p-5 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                            <h4 className="text-md font-bold text-purple-800 mb-4">
                                รายละเอียดการร้องขอความช่วยเหลือ
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                                <DetailItem label="วันที่ร้องขอ">
                                    <p className="font-semibold">
                                        {formatDateYYYY_MM_DD(new Date(currentTask.helpReqAt) || "-")}
                                    </p>
                                </DetailItem>
                                <DetailItem label="ขอความช่วยเหลือจาก">
                                    <span className="px-2.5 py-1 text-sm font-semibold text-purple-800 bg-purple-200 rounded-full">
                                        {currentTask.teamHelp.teamName}
                                    </span>
                                </DetailItem>
                                <DetailItem label="ขอความช่วยเหลือล่วงหน้า">
                                    <p className="font-bold text-purple-800">{helpLeadTime}</p>
                                </DetailItem>
                                <div className="md:col-span-3">
                                    <DetailItem label="รายละเอียด">
                                        <p className="p-3 bg-purple-100 rounded-md border border-purple-200 min-h-[50px] whitespace-pre-wrap">
                                            {/* {task.HelpDetails || "-"} */}
                                        </p>
                                    </DetailItem>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* // TODO: customer section */}
                <div className="pb-6 border-b">
                    ================== ข้อมูล customer ตรงนี้ =========================
                </div>

                {/* === Section: Log === */}
                <div className="grid grid-cols-1 gap-y-6">
                    <DetailItem label="Notes / Result (Log)">
                        <p className="p-3 bg-gray-50 rounded-md border min-h-[100px] whitespace-pre-wrap disabled">
                            {/* // TODO: fetch this properly later */}
                            {currentTask["Notes / Result"] || "-"}
                        </p>
                    </DetailItem>
                </div>
            </div >
        </>
    );
};

export default TaskDetailsView;

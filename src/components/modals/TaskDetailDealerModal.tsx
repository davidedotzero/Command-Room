import { createPortal } from "react-dom";
import { StatusColor } from "../../utils/constants";
import { formatDateYYYY_MM_DD } from "../../utils/functions";
import { useEffect, useState } from "react";
import EditTaskModal from "./EditTaskModal";
import { DetailItem } from "./forms/FormItems";


function TaskDetailDealerModal({ isOpen, onClose, taskData, currentProjectName }: { isOpen: boolean, onClose: () => void, taskData: any, currentProjectName: string }) {
    if (!isOpen) return null;
    // Close Modal on ESC key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        }

        if (isOpen)
            document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    // TODO: do proper isLoading later
    let isLoading = false;

    // taskData keys name are defined like this
    // data-lnw-juan-za = taskData.lnwJuanZa
    // and its always string
    // noice html :thumbs_up:
    const currentTask = JSON.parse(taskData.selectedTask);

    const handleSubmit = async (formData: FormData) => {
        console.log("open edit task dialog here");
        // TODO: switch to using task modal stack
        openEditTaskModal();
    }

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    function openEditTaskModal() { setIsEditTaskModalOpen(true); };
    function closeEditTaskModal() { setIsEditTaskModalOpen(false); };


    return createPortal(
        <>
            <EditTaskModal isOpen={isEditTaskModalOpen} onClose={() => { closeEditTaskModal() }} taskData={currentTask} />

            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <header className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-800">
                            {"รายละเอียด Task"}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-2xl"
                        >
                            &times;
                        </button>
                    </header>

                    {/* // TODO: why overflow is like this????????????????????????? */}
                    {/* // TODO: change from form to normal div???? */}
                    <form action={handleSubmit} className="flex flex-col overflow-hidden flex-1 min-h-0">
                        <div className="overflow-y-auto flex-1">
                            <TaskDetailsView task={currentTask} currentProjectName={currentProjectName} />
                        </div>

                        <footer className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                            >
                                ปิด
                            </button>
                            {/* // TODO: is there a scenario where this modal will be accessed as View only??? */}
                            <button
                                type="submit"
                                // [⭐ BUG FIX] ใช้ onClick + setTimeout(0) เพื่อป้องกัน Race Condition ในทุกกรณี (รวมถึง "Help Me")
                                // TODO: race condition arai ni?
                                onClick={() => {
                                    // เลื่อนการเปลี่ยน State ออกไป เพื่อให้ Event Loop นี้จบก่อน
                                    // setTimeout(() => setIsEditing(true), 0);
                                    //TODO: EditTaskDialog

                                }}
                                className="ml-3 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
                            >
                                แก้ไข Task
                            </button>
                        </footer>
                    </form>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!, // this will always be not null so its safe uwu
    );
}

// TODO: types for selectedTask
// TODO: abstract to other component file
function TaskDetailsView(props) {
    function calculateLeadTime(deadline: Date, requestDate: Date) {
        const diffTime = deadline.getTime() - requestDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

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
                                    {/* {task.HelpAssignee || "-"} */}
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
                )}

                {/* // TODO: customer section */}

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

export default TaskDetailDealerModal;

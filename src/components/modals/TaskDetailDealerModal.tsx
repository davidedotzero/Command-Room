import { createPortal } from "react-dom";
import { StatusColor } from "../../utils/constants";
import { calculateLeadTime, formatDateYYYY_MM_DD } from "../../utils/functions";
import { useEffect, useState } from "react";
import EditTaskModal from "./EditTaskModal";
import { DetailItem } from "./forms/FormItems";
import TaskDetailsView from "./task_detail/TaskDetailsView";
import type { FilteringTask } from "../../utils/types";


function TaskDetailDealerModal({ isOpen, onClose, taskData, currentProjectName, parentUpdateCallback }: { isOpen: boolean, onClose: () => void, taskData: FilteringTask | null, currentProjectName: string, parentUpdateCallback: () => {} }) {
    if (!isOpen) return null;
    if (!taskData) return null;

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
    const currentTask: FilteringTask = taskData;

    const handleSubmit = async (formData: FormData) => {
        console.log("open edit task dialog here");
        // TODO: switch to using task modal stack
        openEditTaskModal();
    }

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    function openEditTaskModal() { setIsEditTaskModalOpen(true); };
    function closeEditTaskModal() { setIsEditTaskModalOpen(false); };

    // TODO: this is ugly asf LMAOOOOOOOOOOOOOOOOOOOOO
    const parentUpdateCallback_eiei = async () => {
        console.log("taskdetaildealermodal parentupdatecallback called");
        onClose();
        parentUpdateCallback();
    }

    return createPortal(
        <>
            <EditTaskModal isOpen={isEditTaskModalOpen} onClose={() => { closeEditTaskModal() }} taskData={currentTask} parentUpdateCallback={parentUpdateCallback_eiei} />

            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
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
                            {/* // TODO: customer section */}
                            <div className="pb-6 border-b">
                                ================== ข้อมูล customer ตรงนี้ =========================
                            </div>
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

export default TaskDetailDealerModal;

import { createPortal } from "react-dom";
import EditTaskModal from "./EditTaskModal";
import { useState } from "react";
import TaskDetailsView from "./task_detail/TaskDetailsView";
import type { FilteringTask } from "../../utils/types";
import LogsView from "./task_detail/LogsView";

function TaskDetailProductionModal({ isOpen, onClose, taskData, parentUpdateCallback }: { isOpen: boolean, onClose: () => void, taskData: FilteringTask | null, parentUpdateCallback: () => {} }) {
    if (!isOpen) return null;
    if (!taskData) return null;

    // TODO: do proper isLoading later
    let isLoading = false;

    // taskData keys name are defined like this
    // data-lnw-juan-za = taskData.lnwJuanZa
    // and its always string
    // noice html :thumbs_up:
    const currentTask = taskData;

    const handleSubmit = async () => {
        // TODO: switch to using task modal stack
        openEditTaskModal();
    }

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    function openEditTaskModal() { setIsEditTaskModalOpen(true); };
    function closeEditTaskModal() { setIsEditTaskModalOpen(false); };

    // TODO: this is ugly asf LMAOOOOOOOOOOOOOOOOOOOOO
    const parentUpdateCallback_eiei = async () => {
        onClose();
        parentUpdateCallback();
    }

    return createPortal(
        <>
            <EditTaskModal isOpen={isEditTaskModalOpen} onClose={() => { closeEditTaskModal() }} taskData={currentTask} parentUpdateCallback={parentUpdateCallback_eiei} />

            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col max-h-[90vh] min-h-[90vh]">
                    <header className="flex justify-between items-center p-6 border-b">
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

                    <div className="flex flex-grow overflow-y-auto">
                        <div className="w-2/5 flex flex-col">
                            <form className="flex flex-col flex-1 min-h-0">
                                <div className="overflow-y-auto">
                                    <TaskDetailsView task={currentTask} />
                                </div>
                            </form>

                            <footer className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-xl">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                                >
                                    ปิด
                                </button>
                                <button
                                    type="submit"
                                    // [⭐ BUG FIX] ใช้ onClick + setTimeout(0) เพื่อป้องกัน Race Condition ในทุกกรณี (รวมถึง "Help Me")
                                    // TODO: race condition arai ni?
                                    onClick={() => {
                                        // เลื่อนการเปลี่ยน State ออกไป เพื่อให้ Event Loop นี้จบก่อน
                                        // setTimeout(() => setIsEditing(true), 0);
                                        handleSubmit();
                                    }}
                                    className="ml-3 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400"
                                >
                                    แก้ไข Task
                                </button>
                            </footer>
                        </div>

                        <div className="w-3/5 overflow-x-auto border-l">
                            <div className="grid grid-cols-1 gap-y-6">
                                <LogsView taskID={currentTask.taskID} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!, // this will always be not null so its safe uwu
    );
}

export default TaskDetailProductionModal;

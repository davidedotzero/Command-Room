import { createPortal } from "react-dom";
import EditTaskModal from "./EditTaskModal";
import { useState } from "react";
import TaskDetailsView from "./task_detail/TaskDetailsView";
import type { FilteringTask } from "../../types/types";
import LogsView from "./task_detail/LogsView";
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalLeft, ModalRight } from "./ModalComponents";

function TaskDetailProductionModal({ isOpen, onClose, taskData, parentUpdateCallback }: { isOpen: boolean, onClose: () => void, taskData: FilteringTask | null, parentUpdateCallback: () => void }) {
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

            <ModalContainer>
                <ModalHeader text={"รายละเอียด Task"} onCloseCallback={onClose} isLoading={isLoading}></ModalHeader>
                <ModalContent>
                    <ModalLeft>
                        <form className="flex flex-col flex-1 min-h-0">
                            <div className="overflow-y-auto">
                                <TaskDetailsView task={currentTask} />
                            </div>
                        </form>

                        <ModalFooter cancelText={"ปิด"} confirmText={"แก้ไข Task"} onCloseCallback={onClose} onSubmitCallback={handleSubmit} isLoading={isLoading} />
                    </ModalLeft>

                    <ModalRight>
                        <div className="grid grid-cols-1 gap-y-6">
                            <LogsView taskID={currentTask.taskID} taskRecentUpdate={currentTask.recentLogsCount} />
                        </div>
                    </ModalRight>
                </ModalContent>
            </ModalContainer>
        </>,
        document.getElementById("modal-root")!, // this will always be not null so its safe uwu
    );
}

export default TaskDetailProductionModal;

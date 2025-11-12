import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import TaskDetailProductionModal from "../components/modals/TaskDetailProductionModal";
import type { FilteringTask } from "../types/types";

interface TaskModalContextType {
    openTaskDetailModal: () => void;
    closeTaskDetailModal: () => void;
    setOnCloseCallback: ((callback: () => void) => void);
    setParentUpdateCallback: (callback: () => void) => void;
    parentUpdateCallback: (() => void) | null;
    onCloseCallback: (() => void) | null;
    setModalTaskData: (taskData: FilteringTask) => void;
    isTaskModalOpen: boolean
};

const TaskModalContext = createContext<TaskModalContextType | null>(null);
export const useTaskModal = () => {
    const context = useContext(TaskModalContext);
    if (!context) {
        throw new Error('useModal must be used within an TaskModalProvider.');
    }
    return context;
}

export function TaskModalProvider({ children }: { children: ReactNode }) {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [onCloseCallback, _setOnCloseCallback] = useState<(() => void) | null>(null);
    const [parentUpdateCallback, _setParentUpdateCallback] = useState<(() => void) | null>(null);
    const [taskData, _setTaskData] = useState<FilteringTask | null>(null);

    const openTaskDetailModal = useCallback(() => {
        setIsTaskModalOpen(true);
    }, []);

    const closeTaskDetailModal = useCallback(() => {
        setIsTaskModalOpen(false);
    }, []);

    const setOnCloseCallback = useCallback((callback: () => void) => {
        _setOnCloseCallback(callback);
    }, []);

    const setParentUpdateCallback = useCallback((callback: () => void) => {
        _setParentUpdateCallback(callback);
    }, []);

    const setModalTaskData = useCallback((t: FilteringTask) => {
        _setTaskData(t);
    }, []);

    return (
        <TaskModalContext.Provider
            value={{
                openTaskDetailModal,
                closeTaskDetailModal,
                setOnCloseCallback,
                setParentUpdateCallback,
                parentUpdateCallback,
                onCloseCallback,
                setModalTaskData,
                isTaskModalOpen,
            }}
        >
            {children}
            <TaskDetailProductionModal
                isOpen={isTaskModalOpen}
                onClose={onCloseCallback === null ? closeTaskDetailModal : onCloseCallback}
                taskData={taskData}
                parentUpdateCallback={parentUpdateCallback === null ? () => { } : parentUpdateCallback}
            />
        </TaskModalContext.Provider>
    );
}

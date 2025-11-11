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
};

const TaskModalContext = createContext<TaskModalContextType | null>(null);
export const useModal = () => useContext(TaskModalContext);

export function TaskModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [onCloseCallback, _setOnCloseCallback] = useState<(() => void) | null>(null);
    const [parentUpdateCallback, _setParentUpdateCallback] = useState<(() => void) | null>(null);
    const [taskData, _setTaskData] = useState<FilteringTask | null>(null);

    const openTaskDetailModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeTaskDetailModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const setOnCloseCallback = useCallback((callback: () => void) => {
        setOnCloseCallback(callback);
    }, []);

    const setParentUpdateCallback = useCallback((callback: () => void) => {
        setParentUpdateCallback(callback);
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
                setModalTaskData
            }}
        >
            {children}
            <TaskDetailProductionModal
                isOpen={isOpen}
                onClose={onCloseCallback === null ? () => { } : onCloseCallback}
                taskData={taskData}
                parentUpdateCallback={parentUpdateCallback === null ? () => { } : parentUpdateCallback}
            />
        </TaskModalContext.Provider>
    );
}

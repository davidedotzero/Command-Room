import type { ReactNode } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { TASK_NAMES, TASKS, TEAMS } from "../../utils/mockdata";


// TODO: abstact this sheesh
const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => {
    const { pending } = useFormStatus();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
};

// TODO: abstact this sheesh
type FormButtonProps = {
    type?: "submit" | "reset" | "button";
    className: string;
    children: ReactNode;
    onClick?: () => void;
    disabledText?: string;
}

// TODO: abstact this sheesh
const FormButton: React.FC<FormButtonProps> = (({ type, className, children, onClick, disabledText }) => {
    const { pending } = useFormStatus();
    return (
        <button
            type={type}
            disabled={pending}
            className={className}
            onClick={onClick}
        >
            {pending ? disabledText ? disabledText : children : children}
            {/* // LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO */}
        </button>
    );
});

const FormFieldSetWrapper: React.FC<{ children: ReactNode }> = (({ children }) => {
    const { pending } = useFormStatus();
    return (
        <fieldset disabled={pending}>{children}</fieldset>
    );
});

// TODO: move this somewhere else better
const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm ...";

function CreateTaskModal({ isOpen, onClose, currentProjectID, parentUpdateCallback, children }: { isOpen: boolean, onClose: () => void, currentProjectID: string, parentUpdateCallback: () => {}, children?: ReactNode }) {
    if (!isOpen) return null;

    // TODO: do proper isLoading later
    let isLoading = false;

    const handleSubmit = async (formData: FormData) => {
        // IMPORTANT: FormData.get() return string | File so we need to parse it to Number and blabla
        const taskNameID: number = Number(formData.get("FormTaskName"));
        const teamID: number = Number(formData.get("FormTeam"));
        const deadlineStr = formData.get("FormDeadline");
        const inProgressStatusID = 1; // default to "In Progress"

        // console.log("task: " + task);
        // console.log("team: " + team);
        // console.log("deadline: " + deadline);

        // TODO: CALL API: add new task to project

        // TODO: generate new task id
        TASKS.push(
            { taskID: "TASK-0069", projectID: currentProjectID, taskNameID: taskNameID, teamID: teamID, deadline: new Date(deadlineStr), statusID: inProgressStatusID, logPreview: "999-PLACEHOLDER" }
        );
        await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: delete this simulate delay

        console.log("sed la");
        onClose();
        parentUpdateCallback();
    }

    // TODO: when pending make controls to grey-ish or better color than this eieiei 
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                //onClick={(e) => e.stopPropagation()} 
                >
                    <header className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">สร้าง Task ใหม่ {currentProjectID}</h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                            &times;
                        </button>
                    </header>
                    <form action={handleSubmit}>
                        <FormFieldSetWrapper>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="md:col-span-2"> <FormField label="Task">
                                    <select
                                        name="FormTaskName"
                                        // onChange={handleChange}
                                        required
                                        className={baseInputClass}
                                    >
                                        {TASK_NAMES.map((taskName) => (<option key={taskName.taskNameID} value={taskName.taskNameID}>{taskName.taskNameStr}</option>))}
                                    </select>
                                </FormField> </div>
                                <FormField label="Team">
                                    <select
                                        name="FormTeam"
                                        // onChange={handleChange}
                                        className={baseInputClass}
                                    >
                                        {TEAMS.map((team) => (<option key={team.teamID} value={team.teamID}> {team.teamName} </option>))}
                                    </select>
                                </FormField>
                                <FormField label="Deadline">
                                    <input
                                        // TODO: change display format to yyyy-mm-dd
                                        // TODO: change border color when submit without input this boi
                                        type="date"
                                        name="FormDeadline"
                                        required
                                        // value={formData.Deadline || ""}
                                        // onChange={handleChange}
                                        className={baseInputClass}
                                    />
                                </FormField>
                            </div>
                        </FormFieldSetWrapper>
                        <footer className="flex justify-end p-6 bg-gray-50 border-t rounded-b-xl">
                            <FormButton type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-purple-900">
                                ยกเลิก
                            </FormButton>
                            <FormButton type="submit" className="ml-3 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-purple-900" disabledText="กำลังสร้าง...">
                                สร้าง Task
                            </FormButton>
                        </footer>
                    </form>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!, // this will always be not null so its safe uwu
    )
}
export default CreateTaskModal;

import { useEffect, useState, type ReactNode } from "react";
import Select, { type SingleValue } from "react-select";

import { createPortal, useFormStatus } from "react-dom";
import { FormButton, FormField, FormFieldSetWrapper } from "./forms/FormItems";
import CreatableSelect from "react-select/creatable";
import { useDbConst } from "../../contexts/DbConstDataContext";
import DatePicker from "react-datepicker";
import { API } from "../../utils/api";
import { genSingleNewID, getOnlyDate } from "../../utils/functions";


// TODO: move this somewhere else better
const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm ...";

function CreateTaskModal({ isOpen, onClose, currentProjectID, parentUpdateCallback, children }: { isOpen: boolean, onClose: () => void, currentProjectID: string, parentUpdateCallback: () => {}, children?: ReactNode }) {
    if (!isOpen) return null;
    //
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

    const { DEFAULT_TASK_NAMES, TEAMS } = useDbConst();

    const [selectedTask, setSelectedTask] = useState<{ value: string, label: string } | null>(null);
    const [selectedTeamID, setSelectedTeamID] = useState<{ value: number, label: string } | null>(null);
    const [selectedDeadline, setSelectedDate] = useState<Date | null>(null);

    // TODO: do proper isLoading later
    let isLoading = false;

    const handleSubmit = async (formData: FormData) => {
        // IMPORTANT: FormData.get() return string | File so we need to parse it to Number and blabla

        // const taskName: string = formData.get("FormTaskName")!;
        // const teamID: number = Number(formData.get("FormTeam"));
        // const deadlineStr = formData.get("FormDeadline");
        const inProgressStatusID = 1; // default to "In Progress"

        // console.log("task: " + taskName);
        // console.log("team: " + teamID);
        // console.log("deadline: " + deadlineStr);

        if (!selectedTask || !selectedTeamID || !selectedDeadline) {
            // TODO: better error handling when backend is setup
            console.error("form grok mai krob dai ngai wa")
            return;
        }

        // TODO: generate ids on backend;
        let a = await API.getLatestTaskID();
        let newTaskID = genSingleNewID(a);

        const newTask =
        {
            taskID: newTaskID,
            projectID: currentProjectID,
            taskName: selectedTask.value,
            teamID: selectedTeamID.value,
            deadline: getOnlyDate(selectedDeadline),
            taskStatusID: inProgressStatusID,

            // TODO: These 6 below properties are useless and should be deleted cuz we hardcoded these in backend anyway but i dont wanna messes with the types for now
            teamHelpID: null,
            helpReqAt: null,
            logPreview: "",
            createdAt: new Date(),
            helpReqReason: null,
            updatedAt: null
        };

        const res = await API.addTask(newTask);
        // TODO: handle result
        // await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: delete this simulate delay

        console.log("sed la");
        onClose();
        parentUpdateCallback();
    }

    const handleTaskChange = async (e: SingleValue<{ value: string, label: string }>) => {
        setSelectedTask(e);
        if (!e) {
            setSelectedTeamID(null);
            return;
        }

        const foundTask = DEFAULT_TASK_NAMES.find(x => x.taskName === e.value);

        if (!foundTask) {
            setSelectedTeamID(null);
            return;
        }

        // TODO: spaghetti asf
        setSelectedTeamID({ value: foundTask.teamID, label: TEAMS.find(x => x.teamID === foundTask.teamID)!.teamName })
    }

    // TODO: when pending make controls to grey-ish or better color than this eieiei 
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
                //onClick={(e) => e.stopPropagation()} 
                >
                    <header className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">สร้าง Task ใหม่</h2>
                        {/* // TODO: make above better looking */}
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
                                <div className="md:col-span-2">
                                    <FormField label="Task">
                                        <CreatableSelect
                                            name="FormTaskName"
                                            className={"shadow-sm"}
                                            required
                                            isClearable={true}
                                            isSearchable={true}
                                            placeholder={"กรอกชื่อ Task ใหม่หรือเลือกรายการจากที่มีอยู่..."}
                                            options={DEFAULT_TASK_NAMES.map(t => ({ value: t.taskName, label: t.taskName }))}
                                            value={selectedTask}
                                            onChange={e => handleTaskChange(e)}
                                        />
                                    </FormField>
                                </div>
                                <FormField label="Team">
                                    <Select
                                        name="FormTeam"
                                        className={"shadow-sm"}
                                        required
                                        isClearable={false}
                                        isSearchable={true}
                                        placeholder={"เลือกทีมที่รับผิดชอบ..."}
                                        options={TEAMS.map(t => ({ value: t.teamID, label: t.teamName }))}
                                        value={selectedTeamID}
                                        onChange={e => setSelectedTeamID(e)}
                                    />
                                </FormField>
                                <FormField label="Deadline">
                                    <DatePicker
                                        name="FormDeadline"
                                        className={"shadow-sm"}
                                        required
                                        filterDate={(date) => { return date.getDay() !== 0 }}
                                        isClearable={true}
                                        placeholderText={"dd/MM/yyyy"}
                                        minDate={new Date()}
                                        selected={selectedDeadline}
                                        onChange={e => setSelectedDate(e)}
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

import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalLeft, ModalRight } from "../ModalComponents";
import { FormField, FormFieldSetWrapper } from "../forms/FormItems";
import DefaultTaskNamesSelect from "../forms/DefaultTaskNamesSelect";
import Select, { type SelectInstance, type SingleValue } from "react-select";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import type { DefaultTaskName, NewTask, Team } from "../../../utils/types";
import DatePicker from "react-datepicker";
import { getOnlyDate } from "../../../utils/functions";
import TeamLabel from "../../utils/TeamLabels";
import { DeleteIcon } from "../../utils/icons";

function CreateTaskModal({ isOpen, onClose, currentProjectID, parentUpdateCallback, children }: { isOpen: boolean, onClose: () => void, currentProjectID: string, parentUpdateCallback: () => {}, children?: ReactNode }) {
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState(false);
    const { DEFAULT_TASK_NAMES, TEAMS } = useDbConst();

    const [selectedTask, setSelectedTask] = useState<{ value: DefaultTaskName | string, label: string } | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<{ value: Team, label: string } | null>(null);
    const [selectedDeadline, setSelectedDate] = useState<Date | null>(null);

    const [projectTasks, setProjectTasks] = useState<NewTask[]>([]);

    const taskNameSelect = useRef<SelectInstance<{ value: DefaultTaskName | string, label: string }>>(null);
    const teamSelect = useRef<SelectInstance<{ value: Team, label: string }>>(null);
    const deadlinePicker = useRef<DatePicker>(null);

    const handleTaskChange = async (e: SingleValue<{ value: DefaultTaskName | string, label: string }>) => {
        console.log(e);
        setSelectedTask(e);
        // TODO: maybe redo this
        if (!e) {
            setSelectedTeam(null);
            return;
        }

        if (!e?.value.teamID) {
            setSelectedTeam(null);
            return;
        }

        const foundTeam = TEAMS.find(x => x.teamID === e?.value.teamID);
        if (!foundTeam) {
            setSelectedTeam(null);
            return;
        }

        setSelectedTeam({ value: foundTeam, label: foundTeam.teamName })
    }

    function handleSubmit() {
        console.log("lnw");
    }

    function handleAddTask(): void {
        // TODO: handle null

        const taskNameSelectInputRef = taskNameSelect.current?.inputRef;
        const teamSelectInputRef = teamSelect.current?.inputRef;
        const deadlinePickerInputRef = deadlinePicker.current?.input as HTMLInputElement;

        if (selectedTask === null) {
            taskNameSelectInputRef?.setCustomValidity("Please fill out this field.");
            taskNameSelectInputRef?.reportValidity();
            return;
        }

        if (isTaskExists(selectedTask.label || selectedTask)) {
            taskNameSelectInputRef?.setCustomValidity("ไม่สามารถใ่ส่ task ซ้ำกันได้");
            taskNameSelectInputRef?.reportValidity();
            return;
        }

        if (selectedTeam === null) {
            teamSelectInputRef?.setCustomValidity("Please fill out this field.");
            teamSelectInputRef?.reportValidity();
            return;
        }

        if (selectedDeadline === null) {
            deadlinePickerInputRef?.setCustomValidity(deadlinePickerInputRef.validationMessage);
            deadlinePickerInputRef?.reportValidity();
            return;
        }

        const newTask: NewTask =
        {
            id: Date.now(),
            taskName: selectedTask.value.taskName || selectedTask!.value,
            team: selectedTeam!.value,
            deadline: getOnlyDate(selectedDeadline!)
        };
        setProjectTasks([newTask, ...projectTasks]);

        setSelectedTask(null);
        setSelectedTeam(null);
        setSelectedDate(null);
    }

    function handleAddAllDefaultTask() {
        console.log("yedhee");
        let newTasks: NewTask[] = [];
        let i = 0;
        for (let defaultTask of DEFAULT_TASK_NAMES) {
            const newTask: NewTask =
            {
                id: Date.now() + i,
                taskName: defaultTask.taskName,
                team: TEAMS.find(x => x.teamID === defaultTask.teamID) ?? "KUYKUYUKYU",
                deadline: getOnlyDate(new Date())
            };
            newTasks.push(newTask);
            i++;
        }

        setProjectTasks([...newTasks, ...projectTasks]);
    }

    function handleTaskItemDateChange(task: NewTask, newDate: Date) {
        const lnw = projectTasks.map(x => task.id === x.id ? { ...x, deadline: getOnlyDate(newDate) } : x);
        setProjectTasks(lnw);
    }

    function handleTaskItemDelete(task: NewTask, e: MouseEvent<HTMLButtonElement, MouseEvent>) {
        // e.stopPropagation();
        setProjectTasks(lnw =>
            lnw.map(x => x.id === task.id ? { ...x, deleting: true } : x)
        );

        setTimeout(() => {
            setProjectTasks(lnw =>
                lnw.filter(x => x.id !== task.id)
            );
        }, 150); // 300 = transition animation 
    }

    function isTaskExists(taskName: string) {
        return projectTasks.some(x => x.taskName === taskName);
    }

    return createPortal(
        <>
            {/* <form> */}
            <ModalContainer>
                <ModalHeader text="สร้าง Task ใหม่" onCloseCallback={onClose} isLoading={isLoading} />
                <ModalContent>
                    <ModalLeft>
                        <FormFieldSetWrapper>
                            <div className="border-b grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5 px-8 py-6">
                                <div className="md:col-span-12">
                                    <FormField label="Task">
                                        <DefaultTaskNamesSelect refEIEI={taskNameSelect} selectedTaskState={selectedTask} onChangeCallback={handleTaskChange} />
                                    </FormField>
                                </div>
                                <div className="md:col-span-12">
                                    <FormField label="Team">
                                        <Select
                                            className={"shadow-sm"}
                                            required
                                            isClearable={false}
                                            isSearchable={true}
                                            placeholder={"เลือกทีมที่รับผิดชอบ..."}
                                            options={TEAMS.map(t => ({ value: t, label: t.teamName }))}
                                            value={selectedTeam}
                                            onChange={e => setSelectedTeam(e)}
                                            ref={teamSelect}
                                        />
                                    </FormField>
                                </div>
                                <div className="md:col-span-8">
                                    <FormField label="Deadline">
                                        {/* <div className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 flex item-center */}
                                        {/* "> */}
                                        <DatePicker
                                            name="FormDeadline"
                                            // className="flex-grow w-full"
                                            required
                                            // showIcon
                                            // toggleCalendarOnIconClick
                                            filterDate={(date) => { return date.getDay() !== 0 }}
                                            isClearable={true}
                                            placeholderText={"..."}
                                            minDate={new Date()}
                                            selected={selectedDeadline}
                                            onChange={e => setSelectedDate(e)}
                                            className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 flex item-center"
                                            ref={deadlinePicker}
                                        />
                                        {/*     <CalendarIcon /> */}
                                        {/* </div> */}
                                    </FormField>
                                </div>
                                <div className="md:col-span-4 flex justify-end items-end">
                                    <button
                                        disabled={isLoading}
                                        type="button"
                                        onClick={handleAddTask}
                                        className={"ml-3 px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"}
                                        children={"+เพิ่ม"} />
                                </div>
                            </div>
                        </FormFieldSetWrapper>

                        <div className="flex-grow flex items-center flex-col space-y-2 p-4">
                            <div>
                                <button
                                    disabled={isLoading}
                                    className="ml-3 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    onClick={handleAddAllDefaultTask}>เพิ่ม task ทั้งหมดจากรายการเริ่มต้น</button>
                            </div>
                            <div>
                                <button
                                    disabled={isLoading}
                                    className="ml-3 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    onClick={() => { setProjectTasks([]) }}>ลบ task ทั้งหมด</button>
                            </div>
                        </div>

                        <ModalFooter cancelText={"ยกเลิก"} confirmText={"PLACEHOLDER CONFIRM"} onCloseCallback={onClose} onSubmitCallback={handleSubmit} isLoading={isLoading} />
                    </ModalLeft >

                    <ModalRight>
                        <div className="space-y-2">
                            {projectTasks.length <= 0 ? (
                                <div className="w-full flex justify-center items-center italic text-gray-500">
                                    {"ไม่มี Task ใหม่"}
                                </div>
                            ) :
                                projectTasks.map((x) => {
                                    return (
                                        <>
                                            <div className={`grid grid-cols-12 gap-3 items-center p-3 rounded-md border bg-white hover:bg-orange-50 border-gray-300 transition-all duration-150 ease-in-out ${x.deleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                                <div className="col-span-1"><input type="checkbox" /></div>
                                                <div className="col-span-4"> {x.taskName} </div>
                                                <div className="col-span-4">
                                                    <DatePicker
                                                        // className="flex-grow w-full"
                                                        required
                                                        // showIcon
                                                        // toggleCalendarOnIconClick
                                                        filterDate={(date) => { return date.getDay() !== 0 }}
                                                        isClearable={false}
                                                        placeholderText={"..."}
                                                        minDate={new Date()}
                                                        selected={x.deadline}
                                                        onChange={e => handleTaskItemDateChange(x, e)}
                                                        popperClassName="!z-[99]"
                                                        portalId="root-portal"
                                                        className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 flex item-center"
                                                    />
                                                </div>
                                                <div className="col-span-2"> <TeamLabel text={x.team.teamName} /> </div>
                                                <div className="col-span-1">
                                                    <button
                                                        onClick={(e) => {
                                                            handleTaskItemDelete(x, e)
                                                        }}
                                                        className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
                                                        aria-label="Delete this task"
                                                        title="Delete this task"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })
                            }
                        </div>
                    </ModalRight >
                </ModalContent>
            </ModalContainer>
            {/* </form > */}
        </>,
        document.getElementById("modal-root")!
    )
}

export default CreateTaskModal;

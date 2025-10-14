import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormButton, FormField, FormFieldSetWrapper } from "../forms/FormItems";
import CreatableSelect from "react-select/creatable";
import Select, { type SingleValue } from "react-select";
import DatePicker from "react-datepicker";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import { useEffectDatePickerFix } from "../../utils/ReactDatePickerBodgeFixHook";
// import { CalendarIcon } from "../../utils/icons";

function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { DEFAULT_TASK_NAMES, TEAMS } = useDbConst();

    const [selectedTask, setSelectedTask] = useState<{ value: string, label: string } | null>(null);
    const [selectedTeamID, setSelectedTeamID] = useState<{ value: number, label: string } | null>(null);
    const [selectedDeadline, setSelectedDate] = useState<Date | null>(null);

    useEffectDatePickerFix();

    const handleSubmit = () => {
        console.log("EIEI");
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



    return createPortal(
        <>
            {alert("ยังไม่เปิดให้ใช่งานตอนนี้")}
        </>,
        document.getElementById("modal-root")!);
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <header className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">สร้างโปรเจกต์ใหม่</h2>
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
                                    <FormField label="Project Name">
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                            placeholder={"กรอกชื่อโปรเจกต์ใหม่"}
                                            required
                                        />
                                    </FormField>
                                </div>
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
                                        placeholderText={"dd/MM/yyyy"}
                                        minDate={new Date()}
                                        selected={selectedDeadline}
                                        onChange={e => setSelectedDate(e)}
                                        className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 flex item-center"
                                    />
                                    {/*     <CalendarIcon /> */}
                                    {/* </div> */}
                                </FormField>
                            </div>
                        </FormFieldSetWrapper>
                        <footer className="flex justify-end p-6 bg-gray-50 border-t rounded-b-xl">
                            <FormButton type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-purple-900">
                                ยกเลิก
                            </FormButton>
                            <FormButton type="submit" className="ml-3 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-purple-900" disabledText="กำลังสร้าง...">
                                สร้าง Project ใหม่
                            </FormButton>
                        </footer>
                    </form >
                </div >
            </div >
        </>,
        document.getElementById("modal-root")!
    );
}

export default CreateProjectModal;

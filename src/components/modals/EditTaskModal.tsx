import { createPortal } from "react-dom";
import { DetailItem, FormButton, FormField, FormFieldSetWrapper } from "./forms/FormItems";
import { useEffect, useState } from "react";
import type { EditLog, FilteringTask, TaskStatus } from "../../utils/types";
import { API } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { EDIT_LOGS, TASKS, TEAMS } from "../../utils/mockdata";
import { calculateLeadTime, formatDateYYYY_MM_DD, getOnlyDate, isOnlyDateEqual, truncateText } from "../../utils/functions";
import Select from "react-select";
import { useDbConst } from "../../contexts/DbConstDataContext";
import DatePicker from "react-datepicker";

function EditTaskModal({ isOpen, onClose, taskData, parentUpdateCallback }: { isOpen: boolean, onClose: () => void, taskData: FilteringTask, parentUpdateCallback: () => {} }) {
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


    // because we pass it in as a json from TaskDetailXXXModal
    const currentTask = taskData;
    // console.log(currentTask);

    const { user } = useAuth();
    const { TASK_STATUSES, TEAMS } = useDbConst();

    const [selectedStatus, setSelectedStatus] = useState<number>(currentTask.statusID);
    const [taskName, setTaskName] = useState<string>(currentTask.taskName);
    const [selectedTeamID, setSelectedTeamID] = useState<{ value: number, label: string } | null>(
        { value: currentTask.teamID, label: TEAMS.find(x => x.teamID === currentTask.teamID)!.teamName }
    );
    const [selectedDeadline, setSelectedDeadline] = useState<Date>(currentTask.deadline);
    const [helpLeadDays, setHelpLeadDays] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // const handleDeadlineChange = (e: Date | null) => {
    //     console.log("kuy");
    //
    //     setSelectedDeadline(e!);
    //
    //     const _helpleaddays = calculateLeadTime(
    //         new Date(selectedDeadline),
    //         currentTask.helpReqAt === null ? new Date() : new Date(currentTask.helpReqAt)
    //     );
    //     setHelpLeadDays(_helpleaddays);
    // }

    useEffect(() => {
        console.log("kuy");

        const _helpleaddays = calculateLeadTime(
            new Date(selectedDeadline),
            currentTask.helpReqAt === null ? new Date() : new Date(currentTask.helpReqAt)
        );
        setHelpLeadDays(_helpleaddays);
    }, [selectedDeadline]);

    const handleSubmit = async (formData: FormData) => {
        console.log("EDIT TASK LAEW JAAAAAA");
        console.log(formData);
        console.log("currentTask ======");
        console.log(currentTask);
        console.log(currentTask.deadline);

        // TODO: check null all of this
        const reason: string = formData.get("FormLogReason")!.toString();
        const logPreview: string = truncateText(reason);
        let toStatusID: number | null = Number(formData.get("FormTaskStatus"));
        let toDeadline: Date | null = new Date(formData.get("FormDeadline")!.toString());
        let teamHelpID: number | null = null;
        let helpReqAt: Date | null = null;
        let helpReqReason: string | null = null;

        if (toStatusID === currentTask.statusID) toStatusID = null;
        if (isOnlyDateEqual(toDeadline, new Date(currentTask.deadline))) toDeadline = null;

        // BUG: changing to help me doesn't work properly
        // TODO: handle if toStatusID is HELPME

        // handle when from something else ---> Help Me
        if (currentTask.statusID !== 3 && toStatusID === 3) { // handle help me
            teamHelpID = Number(formData.get("FormTeamHelp"));
            helpReqAt = new Date();
            helpReqReason = reason;
        }

        // handle when changing from Help Me --> something else
        // we clear help related fields from Task record
        if (currentTask.statusID === 3 && toStatusID !== 3) {
            console.log("clearing");
            teamHelpID = null;
            helpReqAt = null;
            helpReqReason = null;
        }
        // we do this because if status is Help Me --> Help Me
        // no need to update teamHelpID, helpReqAt and helpReqReason

        // TODO: generate new elogid 
        const newLog: EditLog = {
            eLogID: "TEMPTEMPTEMPTEMTPEMTPE",
            date: new Date(),
            reason: formData.get("FormLogReason")!.toString(),
            fromStatusID: toStatusID === null ? null : currentTask.statusID,
            toStatusID: toStatusID,
            fromDeadline: toDeadline === null ? null : new Date(currentTask.deadline),
            toDeadline: toDeadline,
            taskID: currentTask.taskID,
            userID: user.userID,
        };

        // TODO: handle api correctly
        await API.addEditLog(newLog);
        await API.updateTask(currentTask.taskID, taskName, selectedTeamID!.value, toDeadline, teamHelpID, helpReqAt, toStatusID, logPreview, helpReqReason);

        onClose();
        parentUpdateCallback();

        // TODO: loading and confirm dialog and successful dialog
        console.log(EDIT_LOGS);
        console.log(TASKS.find(task => task.taskID === currentTask.taskID));
    }

    // TODO: move this to a better place
    const baseInputClass =
        "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500";

    // TODO: highlight field if its not been edited or its default value
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/50 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <header className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-800">
                            {"แก้ไข Task"}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-2xl"
                        >
                            &times;
                        </button>
                    </header>

                    <form action={handleSubmit} className="flex flex-col overflow-hidden flex-1 min-h-0">
                        <FormFieldSetWrapper>
                            <div className="p-8">
                                {/* === Section: รายละเอียดหลัก === */}
                                <div className="pb-6 border-b">
                                    <div className="overflow-y-auto flex-1">
                                        {/* // TODO: only admin can edit this */}
                                        <FormField label="Task">
                                            <input
                                                name="FormTaskName"
                                                type="text"
                                                required
                                                className={baseInputClass}
                                                value={taskName}
                                                onChange={(e) => setTaskName(e.target.value)}
                                            />
                                        </FormField>
                                        {/* // TODO: only admin can edit this */}
                                        <FormField label="Team">
                                            <Select
                                                name="FormTeam"
                                                className={"shadow-sm"}
                                                required
                                                isClearable={false}
                                                isSearchable={true}
                                                options={TEAMS.map(t => ({ value: t.teamID, label: t.teamName }))}
                                                value={selectedTeamID}
                                                onChange={e => setSelectedTeamID(e)}
                                            />
                                        </FormField>
                                        <FormField label="Deadline">
                                            <DatePicker
                                                name="FormDeadline"
                                                className={"shadow-sm " + baseInputClass}
                                                required
                                                filterDate={(date) => { return date.getDay() !== 0 }}
                                                minDate={new Date()}
                                                selected={selectedDeadline}
                                                onChange={e => setSelectedDeadline(e!)}
                                            />
                                            {/* <input */}
                                            {/*     type="date" */}
                                            {/*     name="FormDeadline" */}
                                            {/*     defaultValue={new Date(currentTask.deadline).toLocaleDateString('en-CA') || ""} // en-CA because its standard short-date format is YYYY-MM-DD */}
                                            {/*     // onChange={handleChange} */}
                                            {/*     className={baseInputClass} */}
                                            {/* /> */}
                                        </FormField>
                                        <FormField label="Status">
                                            <select
                                                name="FormTaskStatus"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                                className={baseInputClass}
                                                defaultValue={currentTask.statusID}
                                            >
                                                {TASK_STATUSES.map((opt) => (
                                                    <option key={opt.statusID} value={opt.statusID}>
                                                        {opt.statusName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                    </div>

                                    {/* Help me */}
                                    {/* // TODO: change this to enum maybe */}
                                    {selectedStatus === 3 && (
                                        <div className="mt-3 p-5 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                <DetailItem label="วันที่ร้องขอ">
                                                    <p className="font-semibold">
                                                        {formatDateYYYY_MM_DD(currentTask.helpReqAt ? new Date(currentTask.helpReqAt) : new Date())}
                                                    </p>
                                                </DetailItem>
                                                <DetailItem label="ขอความช่วยเหลือล่วงหน้า">
                                                    <p className="font-bold text-purple-800">{helpLeadDays} วัน</p>
                                                </DetailItem>
                                                <div className="md:col-span-3">
                                                    <FormField label="ผู้ช่วยเหลือ (Help Assignee)">
                                                        {
                                                            currentTask.statusID === 3 && currentTask.teamHelpID && currentTask.helpReqAt ? (
                                                                // editing help me task. user may not change help assignee again until this helpme is done
                                                                <p className="font-semibold">{TEAMS.find(x => x.teamID === currentTask.teamHelpID)?.teamName || "-"}</p>
                                                            ) : (
                                                                <Select
                                                                    // TODO: defaultValue based from what task i clicked
                                                                    name="FormTeamHelp"
                                                                    required
                                                                    className={"shadow-sm"}
                                                                    isClearable={false}
                                                                    isSearchable={true}
                                                                    placeholder={"เลือกทีมที่ต้องการให้ช่วยเหลือ..."}
                                                                    // TODO: make this from api call
                                                                    options={TEAMS.map((team) => ({ value: team.teamID, label: team.teamName }))}
                                                                />
                                                            )
                                                        }
                                                    </FormField>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* // TODO: fix this bodge */}
                                    {
                                        // only dealer
                                        //                                         currentTask.teamID === 2 && (
                                        //                                             <div className="md:col-span-2 mt-4">
                                        //                                                 <FormField label={"อับโหลดไฟล์"}>
                                        //                                                     <input type="file" />
                                        //                                                 </FormField>
                                        //                                             </div>
                                        //                                         )
                                    }

                                    <div className="md:col-span-2 mt-4">
                                        <div className={`p-4 pt-2 rounded-lg border transition-colors duration-200 bg-yellow-50 border-yellow-400 shadow-md`}>
                                            <FormField label={"รายละเอียดการอัปเดต (จำเป็นต้องกรอก*)'"}>
                                                <textarea
                                                    required
                                                    name="FormLogReason"
                                                    // onChange={(e) => setUpdateReason(e.target.value)}
                                                    className={`${baseInputClass} transition-colors duration-200 border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500`}
                                                    rows={4}
                                                    placeholder={"กรุณาระบุรายละเอียด / เหตุผล"}
                                                />
                                            </FormField>
                                            <p className={`text-sm mt-2 transition-colors duration-200 text-yellow-700 font-medium `}>
                                                * ข้อมูลนี้จะถูกบันทึกลงใน Notes / Result โดยอัตโนมัติเมื่อกดบันทึก
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </FormFieldSetWrapper>

                        <footer className="flex justify-end items-center p-6 border-t bg-gray-50 rounded-b-xl">
                            <FormButton
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                            >
                                ยกเลิก
                            </FormButton>
                            <FormButton
                                type="submit"
                                className="ml-3 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed" disabledText="กำลังบันทึก..."
                            >
                                {'บันทึก'}
                            </FormButton>
                        </footer>
                    </form>
                </div >
            </div >

        </>,
        document.getElementById("modal-root")!
    );
}

export default EditTaskModal;

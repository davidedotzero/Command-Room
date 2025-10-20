import { createPortal } from "react-dom";
import { DetailItem, FormButton, FormField, FormFieldSetWrapper } from "./forms/FormItems";
import { useEffect, useState, type ChangeEvent } from "react";
import type { EditLog, FilteringTask, Task, TaskStatus, User } from "../../utils/types";
import { API } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { EDIT_LOGS, TASKS } from "../../utils/mockdata";
import { calculateLeadTime, formatDateYYYY_MM_DD, getOnlyDate, isOnlyDateEqual, truncateText } from "../../utils/functions";
import Select from "react-select";
import { useDbConst } from "../../contexts/DbConstDataContext";
import DatePicker from "react-datepicker";
import AssigneeLabels from "../utils/AssigneeLabels";
import equal from "fast-deep-equal";

function EditTaskModal(
    { isOpen, onClose, taskData, parentUpdateCallback, customerAndPoData }:
        { isOpen: boolean, onClose: () => void, taskData: FilteringTask, parentUpdateCallback: () => {}, customerAndPoData?: any }) { // TODO: assign type to customerData
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

    const [selectedStatus, setSelectedStatus] = useState<number>(currentTask.taskStatusID);
    const [taskName, setTaskName] = useState<string>(currentTask.taskName);
    const [selectedTeamID, setSelectedTeamID] = useState<{ value: number, label: string } | null>(
        { value: currentTask.teamID, label: TEAMS.find(x => x.teamID === currentTask.teamID)!.teamName }
    );
    const [helpLeadDays, setHelpLeadDays] = useState<number>(0);
    const [selectedDeadline, setSelectedDeadline] = useState<Date>(currentTask.deadline);
    const [selectedWorkers, setSelectedWorkers] = useState<User[]>(currentTask.workers);
    const [listWorkers, setListWorkers] = useState<User[] | null>(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const prevSelectedWorkers = currentTask.workers === null ? [] : currentTask.workers;

    const fetchData = async () => {
        const _listWorkers = await API.getWorkers();
        // TODO: FilteringTask:workers | null add this sheesh 
        if (currentTask.workers === null) {
            setListWorkers(_listWorkers);
        } else {
            let lnws: User[] = [];
            for (let worker of _listWorkers) {
                if (selectedWorkers.some(x => x.userID === worker.userID)) continue;
                lnws.push(worker);
            }
            setListWorkers(lnws);
        }
    }

    useEffect(() => {
        console.log("kuy");

        const _helpleaddays = calculateLeadTime(
            new Date(selectedDeadline),
            currentTask.helpReqAt === null ? new Date() : new Date(currentTask.helpReqAt)
        );
        setHelpLeadDays(_helpleaddays);

        fetchData();
    }, [selectedDeadline]);

    // TODO: loading indicator when file uploading 
    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        console.log("file changed");
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // TODO: not using formData anymore it sucks
    const handleSubmit = async (formData: FormData) => {
        // TODO: check null all of this
        const reason: string = formData.get("FormLogReason")!.toString();
        const logPreview: string = truncateText(reason);
        let toStatusID: number | null = Number(formData.get("FormTaskStatus"));
        let toDeadline: Date | null = new Date(formData.get("FormDeadline")!.toString());
        let teamHelpID: number | null = null;
        let helpReqAt: Date | null = null;
        let helpReqReason: string | null = null;

        console.log({
            reason: reason,
            logPreview: logPreview,
            toStatusID: toStatusID,
            toDeadline: toDeadline,
            teamHelpID: teamHelpID,
            helpReqAt: helpReqAt,
            helpReqReason: helpReqReason
        });

        // handle when from something else ---> Help Me
        if (currentTask.taskStatusID !== 3 && toStatusID === 3) { // handle help me
            console.log("case 1");
            teamHelpID = Number(formData.get("FormTeamHelp"));
            helpReqAt = new Date();
            helpReqReason = reason;
        }

        // handle when changing from Help Me --> something else
        // we clear help related fields from Task record
        if (currentTask.taskStatusID === 3 && toStatusID !== 3) {
            // console.log("clearing");
            console.log("case 2");
            teamHelpID = null;
            helpReqAt = null;
            helpReqReason = null;
        }

        // handle when Help Me --> Help Me
        // we use the old values
        if (currentTask.taskStatusID === 3 && toStatusID === 3) {
            console.log("case 3");

            // doing currentTask.FOOBAR === null check cuz currently theres an anomaly in our data 
            // where teamHelpID, helpReqAt, helpReqReason is blank while the status is HELP ME
            // so we do this to "fix" them retroactively
            // TLDR; these checks are just for fixing anomaly data when we were migrating from spreadsheet -> sql

            if (currentTask.teamHelpID === null) teamHelpID = Number(formData.get("FormTeamHelp"))
            else teamHelpID = currentTask.teamHelpID;

            if (currentTask.helpReqAt === null) helpReqAt = new Date();
            else helpReqAt = currentTask.helpReqAt;

            if (currentTask.helpReqReason === null) helpReqReason = reason;
            else helpReqReason = currentTask.helpReqReason;
        }

        if (toStatusID === currentTask.taskStatusID) toStatusID = null;
        if (isOnlyDateEqual(toDeadline, new Date(currentTask.deadline))) toDeadline = null;

        handleWorkersChange: {
            if (!user?.isAdmin) {
                break handleWorkersChange;
            }

            // WARNING: doesn't work if both arrays are the "same" but different order but that's fine cuz we in the end both toDelete and toAdd is gonna be empty anyway 
            if (equal(selectedWorkers, prevSelectedWorkers)) { // deep comparison from fast-deep-equal
                break handleWorkersChange;
            }

            let toDelete: User[] = [];
            if (prevSelectedWorkers) {
                for (let oldWorker of prevSelectedWorkers) {
                    if (!selectedWorkers.find(x => x.userID === oldWorker.userID)) {
                        toDelete.push(oldWorker);
                    }
                }
            }

            let toAdd: User[] = [];
            if (selectedWorkers) {
                for (let newWorker of selectedWorkers) {
                    if (!prevSelectedWorkers.find(x => x.userID === newWorker.userID)) {
                        toAdd.push(newWorker);
                    }
                }
            }

            console.log(toDelete);
            console.log(toAdd);

            // TODO: handle api correctly
            // TODO: make all of this and below using only 1 api call and a big transaction

            if (toDelete.length > 0) await API.deleteTaskUsers(currentTask.taskID, toDelete);
            if (toAdd.length > 0) await API.addTaskUsers(currentTask.taskID, toAdd);
        }

        // handleFileUpload: {
        //     if (!selectedFile) {
        //         break handleFileUpload;
        //     }
        //
        //     // TODO: do this properly 
        //     // await API.uploadNewPOToTask(currentTask.taskID, )
        // }

        const newLog = {
            reason: formData.get("FormLogReason")!.toString(),
            fromStatusID: toStatusID === null ? null : currentTask.taskStatusID,
            toStatusID: toStatusID,
            fromDeadline: toDeadline === null ? null : currentTask.deadline,
            toDeadline: toDeadline,
            taskID: currentTask.taskID,
            userID: user.userID,
        };

        const updateTask = {
            taskName: taskName,
            deadline: toDeadline === null ? currentTask.deadline : toDeadline,
            taskStatusID: toStatusID === null ? currentTask.taskStatusID : toStatusID,
            teamHelpID: teamHelpID,
            helpReqAt: helpReqAt,
            helpReqReason: helpReqReason,
            logPreview: logPreview,
            teamID: selectedTeamID!.value,
            taskID: currentTask.taskID,
        };

        console.log(updateTask);

        // TODO: handle api correctly
        await API.addEditLog(newLog);
        await API.updateTaskByTaskID(updateTask);

        onClose();
        parentUpdateCallback();

        // TODO: loading and confirm dialog and successful dialog
    }

    if (!listWorkers && !isLoading) {
        return (
            <p className="text-3xl text-red-900">CRITICAL ERROR: FETCHING USERS FROM DATABASE RETURNED NOTHING. PLEASE CONTACT DEVELOPER IMMEDIATELY.</p>
        );
    }

    // TODO: move this to a better place
    const baseInputClass =
        "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500";


    // TODO: highlight field if its not been edited or its default value
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/50 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
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

                    {/* // TODO: separate this sheesh to components */}
                    {/* // TODO: fix overflow when resizing textarea */}
                    <form action={handleSubmit} className="flex flex-col flex-1 min-h-0">
                        <div className="overflow-y-auto">
                            <FormFieldSetWrapper>
                                <div className="p-8">
                                    {/* === Section: รายละเอียดหลัก === */}
                                    <div className="pb-6 border-b">
                                        {/* <div className="overflow-y-auto flex-1"> */}
                                        <FormField label="Task">
                                            <input
                                                disabled={!user?.isAdmin}
                                                name="FormTaskName"
                                                type="text"
                                                required
                                                className={baseInputClass}
                                                value={taskName}
                                                onChange={(e) => setTaskName(e.target.value)}
                                            />
                                        </FormField>
                                        <FormField label="Team">
                                            <Select
                                                isDisabled={!user?.isAdmin}
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
                                        <div className="grid grid-cols-8">
                                            <div className="col-span-2">
                                                <FormField label="Workers">
                                                    <Select
                                                        isDisabled={!user?.isAdmin}
                                                        className={"shadow-sm"}
                                                        isClearable={false}
                                                        isSearchable={true}
                                                        options={listWorkers!.map(x => ({ value: x, label: x.userName }))}
                                                        placeholder="เพิ่มผู้ปฏิบัติ"
                                                        value={null}
                                                        onChange={e => {
                                                            if (!e) {
                                                                return;
                                                            }

                                                            let newSelectedWorkers: User[] = [];
                                                            if (selectedWorkers === null) {
                                                                newSelectedWorkers = newSelectedWorkers.concat(e.value);
                                                            } else {
                                                                newSelectedWorkers = selectedWorkers.concat(
                                                                    e.value
                                                                );
                                                            }

                                                            setSelectedWorkers(newSelectedWorkers);

                                                            const newListWorker = listWorkers!.filter(x => x.userID !== e.value.userID);
                                                            setListWorkers(newListWorker);
                                                        }}
                                                    />
                                                </FormField>
                                            </div>
                                            <div className="col-span-1 flex justify-center items-center text-gray-500">
                                                {/* // TODO: arrow or plus icon here */}
                                                {"=>"}
                                            </div>
                                            {/* // TODO: overflow scrollbar when add so many worker */}
                                            <div className={`border border-gray-300 rounded-md col-span-5 mt-6 shadow-sm p-1 ${!user?.isAdmin && "bg-gray-100"}`}>
                                                {
                                                    selectedWorkers === null ? "" :
                                                        selectedWorkers.map(x => {
                                                            return <AssigneeLabels
                                                                key={x.userID} text={x.userName} closeButton={user?.isAdmin}
                                                                closeButtonCallback={
                                                                    () => {
                                                                        const newSelectedWorkers = selectedWorkers.filter(sw => sw.userID !== x.userID);
                                                                        setSelectedWorkers(newSelectedWorkers);

                                                                        let newListWorker = listWorkers!.concat(x);
                                                                        newListWorker.sort((a, b) => a.userName.localeCompare(b.userName));
                                                                        setListWorkers(newListWorker);
                                                                    }
                                                                }
                                                            />
                                                        })
                                                }
                                            </div>
                                        </div>
                                        <FormField label="Deadline">
                                            <DatePicker
                                                name="FormDeadline"
                                                className={"shadow-sm " + baseInputClass}
                                                required
                                                filterDate={(date) => { return date.getDay() !== 0 }}
                                                selected={selectedDeadline}
                                                onChange={e => setSelectedDeadline(e!)}
                                            />
                                        </FormField>
                                        <FormField label="Status">
                                            <select
                                                name="FormTaskStatus"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                                className={baseInputClass}
                                                defaultValue={currentTask.taskStatusID}
                                            >
                                                {TASK_STATUSES.map((opt) => (
                                                    <option key={opt.taskStatusID} value={opt.taskStatusID}>
                                                        {opt.taskStatusName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormField>
                                        {/* </div> */}

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
                                                                currentTask.taskStatusID === 3 && currentTask.teamHelpID && currentTask.helpReqAt ? (
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
                                        {/* // TODO: make this have a checkbox to turn on or smth */}
                                        {/* // TODO: make loading indicator when uploading file */}
                                        {
                                            // only dealer
                                            // currentTask.teamID === 2 && (
                                            // <div className="md:col-span-2 mt-4">
                                            // <FormField label={"แนบไฟล์ PO"}>
                                            // <input type="file" onChange={handleFileChange} className={baseInputClass} />
                                            // </FormField>
                                            // </div>
                                            // )
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
                        </div>

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

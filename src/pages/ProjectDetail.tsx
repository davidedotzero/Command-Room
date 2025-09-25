import { useParams } from "react-router";
import { PlusIcon, RefreshIcon } from "../components/utils/icons";
import { useMemo } from "react";

// TODO: abstract this to other file
const StatDisplayCard: React.FC<{
    label: string;
    value: number;
    color: string;
    isActive: boolean;
    onClick: () => void;
    description: string;
}> = ({ label, value, color, isActive, onClick, description }) => (
    <div className="relative group flex justify-center">
        <button
            onClick={onClick}
            // TODO: change bg-gray to maybe lighter?
            className={`flex items-center space-x-2 p-3 bg-gray-100 rounded-lg w-full text-left transition-all duration-200 ${isActive ? "ring-2 ring-orange-500 shadow-md" : "hover:bg-gray-200"
                }`}
        >
            <span className={`font-bold text-xl ${color}`}>{value}</span>
            <span className="text-sm text-gray-600">{label}</span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 px-3 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm scale-0 group-hover:scale-100 transition-transform origin-bottom z-10">
            {description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
        </div>
    </div>
);

const statDescriptions = {
    overdue: "งานที่ยังไม่เสร็จและเลยกำหนดส่งแล้ว",
    warning: "งานที่ยังไม่เสร็จและใกล้ถึงกำหนดส่งใน 10 วัน",
    incomplete: "งานทั้งหมดที่ยังต้องดำเนินการ (สถานะไม่ใช่ 'เสร็จสิ้น' หรือ 'ยกเลิก')",
    done: "งานทั้งหมดที่มีสถานะ 'เสร็จสิ้น'",
    helpMe: "งานที่ทีมกำลังร้องขอความช่วยเหลือ",
};

// TODO: maybe merge this to Status as a "table"?
let StatusColor = new Map<string, string>();
StatusColor.set("Not Started", "text-gray-500");
StatusColor.set("In Progress", "text-blue-500");
StatusColor.set("Help Me", "text-purple-500");
StatusColor.set("Done", "text-green-500");
StatusColor.set("Cancelled", "text-red-500");

// TODO: abstract to types.tsx
// TODO: make this id+name ????
type Status = "Not Started" | "In Progress" | "Help Me" | "Done" | "Cancelled"; // TODO: me cancel duai mai???
type POStatus = "PLACEHOLDER" | "PLACEHOLDER2";
type ProjectTaskName = "ธรรมมะ กระตุกจิตกระชากใจ" | "เพื่อบรรลุอรหันต์" | "มันต้องเป็นแบบนี้ ต้องมีอุปกรณ์" | "อย่างงี้เค้าเรียกชนฉิ่งตีฉิ่ง" | "ท่าอย่างงี้เค้าเรียกว่าkระเd้าคู่" | "คนนี้ที คนนี้ที" | "อย่างงี้เค้าเรียกว่า ดูดuม" | "ดูดขวา ดูดซ้าย";
type ProjectOwner = "PRODUCT" | "MARKETING" | "AJ-DAENG";

// TODO: abstract to types.tsx
// TODO: will change this when i know what fields are supposed to be in projectTask
// TODO: add preview log field
interface ProjectTask { // should not use "Task" because a collision with JSX's Task
    taskID: string,
    projectID: string,
    name: ProjectTaskName,
    owner: ProjectOwner,
    deadline: Date,
    status: Status,
    logPreview: string // this should be the "description" of the latest log for the task
};

// TODO: DELETE MOCKUP DATA
// TODO: add preview log field
const tasks: ProjectTask[] = [
    { taskID: "TASK-0001", projectID: "PROJ-CRM-0007", name: "ท่าอย่างงี้เค้าเรียกว่าkระเd้าคู่", owner: "AJ-DAENG", deadline: new Date("2025-12-11"), status: "In Progress", logPreview: "002-PLACEHOLDER" },
    { taskID: "TASK-0002", projectID: "PROJ-CRM-0002", name: "ดูดขวา ดูดซ้าย", owner: "PRODUCT", deadline: new Date("2025-11-25"), status: "Not Started", logPreview: "003-PLACEHOLDER" },
    { taskID: "TASK-0003", projectID: "PROJ-CRM-0009", name: "อย่างงี้เค้าเรียกว่า ดูดuม", owner: "MARKETING", deadline: new Date("2025-10-30"), status: "Done", logPreview: "004-PLACEHOLDER" },
    { taskID: "TASK-0004", projectID: "PROJ-CRM-0001", name: "คนนี้ที คนนี้ที", owner: "AJ-DAENG", deadline: new Date("2025-12-05"), status: "Help Me", logPreview: "005-PLACEHOLDER" },
    { taskID: "TASK-0005", projectID: "PROJ-CRM-0005", name: "เพื่อบรรลุอรหันต์", owner: "PRODUCT", deadline: new Date("2025-11-18"), status: "In Progress", logPreview: "006-PLACEHOLDER" },
    { taskID: "TASK-0006", projectID: "PROJ-CRM-0010", name: "ธรรมมะ กระตุกจิตกระชากใจ", owner: "MARKETING", deadline: new Date("2025-10-15"), status: "Not Started", logPreview: "007-PLACEHOLDER" },
    { taskID: "TASK-0007", projectID: "PROJ-CRM-0003", name: "มันต้องเป็นแบบนี้ ต้องมีอุปกรณ์", owner: "AJ-DAENG", deadline: new Date("2025-12-22"), status: "Done", logPreview: "008-PLACEHOLDER" },
    { taskID: "TASK-0008", projectID: "PROJ-CRM-0008", name: "อย่างงี้เค้าเรียกชนฉิ่งตีฉิ่ง", owner: "PRODUCT", deadline: new Date("2025-11-02"), status: "In Progress", logPreview: "009-PLACEHOLDER" },
    { taskID: "TASK-0009", projectID: "PROJ-CRM-0004", name: "ท่าอย่างงี้เค้าเรียกว่าkระเd้าคู่", owner: "MARKETING", deadline: new Date("2025-10-21"), status: "Help Me", logPreview: "010-PLACEHOLDER" },
    { taskID: "TASK-0010", projectID: "PROJ-CRM-0006", name: "ดูดขวา ดูดซ้าย", owner: "AJ-DAENG", deadline: new Date("2025-12-14"), status: "Not Started", logPreview: "011-PLACEHOLDER" },
    { taskID: "TASK-0011", projectID: "PROJ-CRM-0001", name: "อย่างงี้เค้าเรียกว่า ดูดuม", owner: "PRODUCT", deadline: new Date("2025-11-09"), status: "Done", logPreview: "012-PLACEHOLDER" },
    { taskID: "TASK-0012", projectID: "PROJ-CRM-0007", name: "คนนี้ที คนนี้ที", owner: "MARKETING", deadline: new Date("2025-10-28"), status: "In Progress", logPreview: "013-PLACEHOLDER" },
    { taskID: "TASK-0013", projectID: "PROJ-CRM-0002", name: "เพื่อบรรลุอรหันต์", owner: "AJ-DAENG", deadline: new Date("2025-12-01"), status: "Not Started", logPreview: "014-PLACEHOLDER" },
    { taskID: "TASK-0014", projectID: "PROJ-CRM-0009", name: "ธรรมมะ กระตุกจิตกระชากใจ", owner: "PRODUCT", deadline: new Date("2025-11-15"), status: "Help Me", logPreview: "015-PLACEHOLDER" },
    { taskID: "TASK-0015", projectID: "PROJ-CRM-0005", name: "มันต้องเป็นแบบนี้ ต้องมีอุปกรณ์", owner: "MARKETING", deadline: new Date("2025-10-08"), status: "Done", logPreview: "016-PLACEHOLDER" },
    { taskID: "TASK-0016", projectID: "PROJ-CRM-0010", name: "อย่างงี้เค้าเรียกชนฉิ่งตีฉิ่ง", owner: "AJ-DAENG", deadline: new Date("2025-12-28"), status: "In Progress", logPreview: "017-PLACEHOLDER" },
    { taskID: "TASK-0017", projectID: "PROJ-CRM-0003", name: "ท่าอย่างงี้เค้าเรียกว่าkระเd้าคู่", owner: "PRODUCT", deadline: new Date("2025-11-20"), status: "Not Started", logPreview: "018-PLACEHOLDER" },
    { taskID: "TASK-0018", projectID: "PROJ-CRM-0008", name: "ดูดขวา ดูดซ้าย", owner: "MARKETING", deadline: new Date("2025-10-12"), status: "In Progress", logPreview: "019-PLACEHOLDER" },
    { taskID: "TASK-0019", projectID: "PROJ-CRM-0004", name: "อย่างงี้เค้าเรียกว่า ดูดuม", owner: "AJ-DAENG", deadline: new Date("2025-12-08"), status: "Done", logPreview: "020-PLACEHOLDER" },
    { taskID: "TASK-0020", projectID: "PROJ-CRM-0006", name: "คนนี้ที คนนี้ที", owner: "PRODUCT", deadline: new Date("2025-11-28"), status: "Help Me", logPreview: "021-PLACEHOLDER" },
    { taskID: "TASK-0021", projectID: "PROJ-CRM-0001", name: "เพื่อบรรลุอรหันต์", owner: "MARKETING", deadline: new Date("2025-10-19"), status: "Not Started", logPreview: "022-PLACEHOLDER" },
    { taskID: "TASK-0022", projectID: "PROJ-CRM-0007", name: "ธรรมมะ กระตุกจิตกระชากใจ", owner: "AJ-DAENG", deadline: new Date("2025-12-18"), status: "In Progress", logPreview: "023-PLACEHOLDER" },
    { taskID: "TASK-0023", projectID: "PROJ-CRM-0002", name: "มันต้องเป็นแบบนี้ ต้องมีอุปกรณ์", owner: "PRODUCT", deadline: new Date("2025-11-05"), status: "Done", logPreview: "024-PLACEHOLDER" },
    { taskID: "TASK-0024", projectID: "PROJ-CRM-0009", name: "อย่างงี้เค้าเรียกชนฉิ่งตีฉิ่ง", owner: "MARKETING", deadline: new Date("2025-10-25"), status: "In Progress", logPreview: "025-PLACEHOLDER" },
    { taskID: "TASK-0025", projectID: "PROJ-CRM-0005", name: "ท่าอย่างงี้เค้าเรียกว่าkระเd้าคู่", owner: "AJ-DAENG", deadline: new Date("2025-12-03"), status: "Help Me", logPreview: "026-PLACEHOLDER" },
    { taskID: "TASK-0026", projectID: "PROJ-CRM-0010", name: "ดูดขวา ดูดซ้าย", owner: "PRODUCT", deadline: new Date("2025-11-12"), status: "Not Started", logPreview: "027-PLACEHOLDER" },
    { taskID: "TASK-0027", projectID: "PROJ-CRM-0003", name: "อย่างงี้เค้าเรียกว่า ดูดuม", owner: "MARKETING", deadline: new Date("2025-10-05"), status: "Done", logPreview: "028-PLACEHOLDER" },
    { taskID: "TASK-0028", projectID: "PROJ-CRM-0008", name: "คนนี้ที คนนี้ที", owner: "AJ-DAENG", deadline: new Date("2025-12-25"), status: "In Progress", logPreview: "029-PLACEHOLDER" },
    { taskID: "TASK-0029", projectID: "PROJ-CRM-0004", name: "เพื่อบรรลุอรหันต์", owner: "PRODUCT", deadline: new Date("2025-11-22"), status: "Help Me", logPreview: "030-PLACEHOLDER" },
    { taskID: "TASK-0030", projectID: "PROJ-CRM-0006", name: "ธรรมมะ กระตุกจิตกระชากใจ", owner: "MARKETING", deadline: new Date("2025-10-17"), status: "Not Started", logPreview: "031-PLACEHOLDER" }
];


function ProjectDetail() {
    let param = useParams();
    const currentProjectID = param.projectID;
    //
    // TODO: usememo this
    const tasksByProjectID: ProjectTask[] = tasks.filter(t => t.projectID === currentProjectID);

    const statusMetrics = useMemo(() => {
        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        let overdue = 0, warning = 0, incomplete = 0, done = 0, helpme = 0;
        tasksByProjectID.forEach(task => {
            if (task.deadline && task.deadline < TODAY) overdue += 1;

            if (task.deadline >= TODAY && task.deadline <= WARNING_DATE) {
                if (task.deadline) {
                    console.log(task)
                    warning += 1;
                }
            }

            if (task.status !== "Done" && task.status !== "Cancelled") incomplete += 1;
            if (task.status === "Help Me") helpme += 1;
            if (task.status === "Done") done += 1;
        });

        return { overdue, warning, incomplete, done, helpme }
    });

    const filteredAndSortedTasks = useMemo(() => {
        const dayAhead = 10; // TODO: make this customizable by user or maybe make this global constant
        const today = new Date();
        const warningDate = new Date().setDate(today.getDate() + dayAhead);

        let tasksToProcess = tasksByProjectID;

        // if (activeStatFilter) {
        //     const incomplete = tasks.filter(
        //         (t) => t.Status !== "Done" && t.Status !== "Cancelled"
        //     );
        //     switch (activeStatFilter) {
        //         case "Overdue":
        //             tasksToProcess = incomplete.filter(
        //                 (t) => t.Deadline && t.Deadline < today
        //             );
        //             break;
        //         case "Warning":
        //             tasksToProcess = incomplete.filter((t) => {
        //                 if (!t.Deadline) return false;
        //                 return t.Deadline >= today && t.Deadline <= warningDate;
        //             });
        //             break;
        //         case "Incomplete":
        //             tasksToProcess = incomplete;
        //             break;
        //         case "Done":
        //             tasksToProcess = tasks.filter((t) => t.Status === "Done");
        //             break;
        //         case "Help Me":
        //             tasksToProcess = tasks.filter((t) => t.Status === "Help Me");
        //             break;
        //     }
        // }
        //
        // let finalFiltered = tasksToProcess.filter((task) => {
        //     // [✅ แก้ไข] ใช้ task.HelpAssignee โดยตรง (ไม่ต้องใช้ as any เพราะแก้ไข types.ts แล้ว)
        //     const matchesOwner = ownerFilter
        //         ? task.Owner === ownerFilter || task.HelpAssignee === ownerFilter
        //         : true;
        //     const matchesStatus = statusFilter ? task.Status === statusFilter : true;
        //     const matchesSearch = searchQuery
        //         ? task.Task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //         (task["Notes / Result"] || "")
        //             .toLowerCase()
        //             .includes(searchQuery.toLowerCase())
        //         : true;
        //     return matchesOwner && matchesStatus && matchesSearch;
        // });
        //
        // finalFiltered.sort((a, b) => {
        //     const aHasDeadline = a.Deadline != null && a.Deadline !== "";
        //     const bHasDeadline = b.Deadline != null && b.Deadline !== "";
        //
        //     // จัดการ Null/Empty (เรียงตามลำดับ Ascending: มี Deadline ก่อน)
        //     if (aHasDeadline && !bHasDeadline) return -1;
        //     if (!aHasDeadline && bHasDeadline) return 1;
        //     if (!aHasDeadline && !bHasDeadline) return 0;
        //
        //     // ใช้การเปรียบเทียบ String (YYYY-MM-DD)
        //     if (a.Deadline! < b.Deadline!) return -1;
        //     if (a.Deadline! > b.Deadline!) return 1;
        //     return 0;
        // });

        let finalFiltered = tasksToProcess;
        return finalFiltered;
    },
        // [tasks, ownerFilter, statusFilter, searchQuery, activeStatFilter]
        []
    );
    return (
        <>
            <h1>{currentProjectID}</h1> {/* // TODO: remove this */}
            <div className="space-y-6">
                {/*  TODO: split to separate components */}
                {/* KPIs Summary Section */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-bold text-gray-700">
                            สรุปสถานะ Task ของโปรเจกต์นี้
                        </h3>
                        <button
                            // onClick={refreshAllData}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors"
                            aria-label="Refresh data"
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatDisplayCard
                            label="Overdue"
                            value={statusMetrics.overdue}
                            color="text-red-500"
                            // isActive={activeStatFilter === "Overdue"}
                            // onClick={() => handleStatFilterClick("Overdue")}
                            description={statDescriptions.overdue}
                            isActive={false}
                            onClick={() => { }}
                        />
                        <StatDisplayCard
                            label="Warning"
                            value={statusMetrics.warning}
                            color="text-yellow-500"
                            // isActive={activeStatFilter === "Warning"}
                            // onClick={() => handleStatFilterClick("Warning")}
                            description={statDescriptions.warning}
                            isActive={false}
                            onClick={() => { }}
                        />
                        <StatDisplayCard
                            label="Incomplete"
                            value={statusMetrics.incomplete}
                            color="text-blue-500"
                            // isActive={activeStatFilter === "Incomplete"}
                            // onClick={() => handleStatFilterClick("Incomplete")}
                            description={statDescriptions.incomplete}
                            isActive={false}
                            onClick={() => { }}
                        />
                        <StatDisplayCard
                            label="Done"
                            value={statusMetrics.done}
                            color="text-green-500"
                            // isActive={activeStatFilter === "Done"}
                            // onClick={() => handleStatFilterClick("Done")}
                            description={statDescriptions.done}
                            isActive={false}
                            onClick={() => { }}
                        />
                        <StatDisplayCard
                            label="Help Me"
                            value={statusMetrics.helpme}
                            color="text-purple-500"
                            // isActive={activeStatFilter === "Help Me"}
                            // onClick={() => handleStatFilterClick("Help Me")}
                            description={statDescriptions.helpMe}
                            isActive={false}
                            onClick={() => { }}
                        />
                    </div>
                </div>

                {/* Filter Section */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-bold text-gray-700">
                            ตัวกรองและเครื่องมือ
                        </h3>
                        {currentProjectID && currentProjectID !== "ALL" ? (
                            <button
                                // onClick={openCreateTaskModal}
                                className="flex items-center px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors
                duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span className="ml-2">เพิ่ม Task</span>
                            </button>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                (เลือกโปรเจกต์เพื่อเพิ่ม Task)
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* // TODO: abstract this to comboBox component */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Owner / Assignee
                            </label>
                            <select
                                // value={ownerFilter}
                                // onChange={(e) => setOwnerFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">-- ทีมทั้งหมด --</option>
                                {/* {ownerOptions.map((opt) => ( */}
                                {/*     <option key={opt} value={opt}> */}
                                {/*         {opt} */}
                                {/*     </option> */}
                                {/* ))} */}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Status
                            </label>
                            <select
                                // value={statusFilter}
                                // onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">-- ทุกสถานะ --</option>
                                {/* {statusOptions.map((opt) => ( */}
                                {/*     <option key={opt} value={opt}> */}
                                {/*         {opt} */}
                                {/*     </option> */}
                                {/* ))} */}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                ค้นหา Task / Note
                            </label>
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                // value={searchQuery}
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                onChange={() => { }}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>
                </div>

                {/* [✅ เพิ่ม] Bulk Action Bar */}
                {/* TODO: bulk selection and editing on table */}
                { //selectedTaskIds.size > 0 && (
                    //     <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-300 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 sticky top-0 z-10">
                    //         <div className="text-sm font-medium text-blue-800">
                    //             เลือกแล้ว {selectedTaskIds.size} รายการ
                    //         </div>
                    //         <div className="flex flex-wrap items-center gap-4">
                    //             <label
                    //                 htmlFor="bulk-deadline-input"
                    //                 className="text-sm font-medium text-gray-700"
                    //             >
                    //                 กำหนด Deadline ใหม่:
                    //             </label>
                    //             <input
                    //                 id="bulk-deadline-input"
                    //                 type="date"
                    //                 value={newDeadline}
                    //                 onChange={(e) => setNewDeadline(e.target.value)}
                    //                 className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    //             />
                    //             <button
                    //                 onClick={handleBulkUpdate}
                    //                 disabled={!newDeadline || isBulkUpdating}
                    //                 className={`px-4 py-2 text-sm font-semibold rounded-md text-white transition-colors duration-200 ${!newDeadline || isBulkUpdating
                    //                     ? "bg-gray-400 cursor-not-allowed"
                    //                     : "bg-orange-500 hover:bg-orange-600 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    //                     }`}
                    //             >
                    //                 {isBulkUpdating ? "กำลังอัปเดต..." : "ยืนยันการแก้ไข"}
                    //             </button>
                    //             <button
                    //                 onClick={() => {
                    //                     setSelectedTaskIds(new Set());
                    //                     setNewDeadline("");
                    //                 }}
                    //                 className="text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 hover:bg-gray-200 rounded-md"
                    //             >
                    //                 ยกเลิกการเลือก
                    //             </button>
                    //         </div>
                    //     </div>
                    // )
                }

                {/**/}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-all-search"
                                            type="checkbox"
                                            // checked={isAllSelected}
                                            // onChange={handleSelectAll}
                                            // [✅ เพิ่ม] จัดการ Indeterminate state โดยใช้ Callback Ref
                                            // ref={(input) => {
                                            //     if (input) {
                                            //         input.indeterminate = isPartialSelected;
                                            //     }
                                            // }}
                                            // Disable ถ้าไม่มี Task ที่แก้ไขได้เลย
                                            // disabled={editableTasksInView.length === 0}
                                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50 cursor-pointer"
                                        // title={
                                        // editableTasksInView.length === 0
                                        // ? "ไม่มี Task ที่คุณแก้ไขได้ในมุมมองนี้"
                                        // : "เลือกทั้งหมด (ที่แก้ไขได้)"
                                        // }
                                        />
                                        <label htmlFor="checkbox-all-search" className="sr-only">
                                            เลือกทั้งหมด
                                        </label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Deadline
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Task
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Note/Result
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Owner
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    To Team
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Help Assignee
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Help Details
                                </th>
                                <th scope="col" className="px-6 py-3 font-medium text-left">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 font-medium text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAndSortedTasks.map((task) => {
                                {/* // [✅ เพิ่ม] ตรวจสอบสิทธิ์การแก้ไข */ }
                                {/* const userCanEdit = canEditTask(user, task); */ }
                                {/* const isSelected = selectedTaskIds.has(task._id); */ }

                                // TODO: remove this
                                const userCanEdit = true;
                                return (
                                    <tr key={task.taskID} className="bg-white hover:bg-orange-50 cursor-pointer"
                                    //onClick={() => openEditModal(task)}
                                    >
                                        <td className="w-4 p-4">
                                            {/* {userCanEdit ? ( */}
                                            {/*     <div className="flex items-center"> */}
                                            {/*         <input */}
                                            {/*             id={`checkbox-table-search-${task.taskID}`} */}
                                            {/*             type="checkbox" */}
                                            {/*             checked={isSelected} */}
                                            {/*             onChange={() => handleSelectOne(task.taskID)} */}
                                            {/*             className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 cursor-pointer" */}
                                            {/*         /> */}
                                            {/*         <label */}
                                            {/*             htmlFor={`checkbox-table-search-${task.taskID}`} */}
                                            {/*             className="sr-only" */}
                                            {/*         > */}
                                            {/*             checkbox */}
                                            {/*         </label> */}
                                            {/*     </div> */}
                                            {/* ) : ( */}
                                            {/*     // แสดงช่องว่างถ้าแก้ไขไม่ได้ เพื่อให้ Layout ไม่เลื่อน */}
                                            {/*     <div */}
                                            {/*         className="w-4 h-4" */}
                                            {/*         title="คุณไม่มีสิทธิ์แก้ไข Task นี้" */}
                                            {/*     ></div> */}
                                            {/* )} */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {`${task.deadline.getDate()}/${task.deadline.getMonth()}/${task.deadline.getFullYear()}`}
                                        </td>
                                        <td
                                            className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate"
                                            title={task.name}
                                        >
                                            {task.name}
                                        </td>
                                        <td
                                            className="px-6 py-4 text-gray-600 max-w-sm truncate"
                                            title={task.logPreview} // TODO: maybe title is not need?
                                        >
                                            {task.logPreview + " / " + task.projectID}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                                {task.owner}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            {/* <AssigneeLabels text={task["Feedback to Team"]} /> */}
                                            {"feedback PLACEHOLDER"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-medium">
                                            {/* {task.HelpAssignee || "-"} */}
                                            {"help assignee PLACEHOLDER"}
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
                                        // title={task.HelpDetails || undefined}
                                        >
                                            {/* {truncateText(task.HelpDetails, 10)} */}
                                            {"help detail PLACEHOLDER"}
                                        </td>
                                        <td
                                            className={`px-6 py-4 font-semibold ${StatusColor.get(task.status) || "text-gray-500"}`}
                                        >
                                            {task.status}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {/* <div className="flex items-center justify-center space-x-1"> */}
                                            {/*     <button */}
                                            {/*         onClick={() => onTaskView(task)} */}
                                            {/*         className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100" */}
                                            {/*         aria-label="View Task Details" */}
                                            {/*     > */}
                                            {/*         <ViewIcon /> */}
                                            {/*     </button> */}
                                            {/*     {userCanEdit && ( */}
                                            {/*         <> */}
                                            {/*             <button */}
                                            {/*                 onClick={() => onEditTask(task)} */}
                                            {/*                 className="text-gray-500 hover:text-orange-600 p-2 rounded-full hover:bg-orange-100" */}
                                            {/*                 aria-label="Edit Task" */}
                                            {/*             > */}
                                            {/*                 <EditIcon /> */}
                                            {/*             </button> */}
                                            {/*             <button */}
                                            {/*                 onClick={() => onDeleteTask(task)} */}
                                            {/*                 className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100" */}
                                            {/*                 aria-label="Delete Task" */}
                                            {/*             > */}
                                            {/*                 <DeleteIcon /> */}
                                            {/*             </button> */}
                                            {/*         </> */}
                                            {/*     )} */}
                                            {/* </div> */}
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* {filteredAndSortedTasks.length === 0 && ( */}
                            {/*     <tr> */}
                            {/*         <td colSpan={9} className="text-center py-10 text-gray-500"> */}
                            {/*             กำลังอัปเดต Task ที่ตรงกับเกณฑ์ */}
                            {/*         </td> */}
                            {/*     </tr> */}
                            {/* )} */}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ProjectDetail;

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";

import { PlusIcon, RefreshIcon } from "../components/utils/icons";

import type { Task } from "../utils/types";
import { leftJoinOne2One, PROJECTS, TASK_NAMES, TASK_STATUSES, TASKS, TEAMS } from "../utils/mockdata";

import TaskDetailModal from "../components/modals/TaskDetailModal";
import TaskDetailDealerModal from "../components/modals/TaskDetailDealerModal";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import { StatusColor } from "../utils/constants";
import { getDateYYYY_MM_DD } from "../utils/functions";

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


// TODO: abstract this to separate mock api files
const callApi = {
    getTasks: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000)); // TODO: delete this simulate delay
        return [...TASKS];
    },
    addTasks: async (newTask: Task) => {
        TASKS.push(newTask);
        return true;
    },
    getProjectNameById: async (projectID: string) => {
        // TODO: handle when name not found
        return PROJECTS.find(proj => proj.projectID === projectID)?.projectName!;
    },
};

// TODO: fix re-renders on open CreateTaskModal!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function ProjectDetail() {
    let param = useParams();
    if (!param.projectID) {
        // TODO: better error page
        return <p>NO PROJECT SELECTED</p>;
    }
    const currentProjectID: string = param.projectID; // TODO: should i pass this as props or urlParams?
    const [currentProjectName, setCurrentProjectName] = useState<string>("");
    const [lnw_task, setLnw_task] = useState<Task[]>([]); // TODO: rename this
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await callApi.getTasks();
        const projectName = await callApi.getProjectNameById(currentProjectID);

        setLnw_task(data);
        setCurrentProjectName(projectName);

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    // TODO: usememo this
    // TODO: make select task by projectid an api call
    const tasksByProjectID: Task[] = lnw_task.filter((t: Task) => t.projectID === currentProjectID);
    // TODO: temp mockdata
    const tasksJoinTaskName = leftJoinOne2One(tasksByProjectID, TASK_NAMES, "taskNameID", "taskNameID", "taskName");
    const tasksJoinTeam = leftJoinOne2One(tasksJoinTaskName, TEAMS, "teamID", "teamID", "team");
    const tasksJoinStatus = leftJoinOne2One(tasksJoinTeam, TASK_STATUSES, "statusID", "statusID", "status");

    const processingTasks = tasksJoinStatus;

    const statusMetrics = useMemo(() => {
        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        let overdue = 0, warning = 0, incomplete = 0, done = 0, helpme = 0;
        processingTasks.forEach(task => {
            // TODO: rewrite this counting logic
            if (task.deadline && task.deadline < TODAY) overdue += 1;

            if (task.deadline >= TODAY && task.deadline <= WARNING_DATE) {
                if (task.deadline) {
                    warning += 1;
                }
            }

            if (task.status.statusName !== "Done" && task.status.statusName !== "Cancelled") incomplete += 1;
            if (task.status.statusName === "Help Me") helpme += 1;
            if (task.status.statusName === "Done") done += 1;
        });

        return { overdue, warning, incomplete, done, helpme }
    }, [processingTasks]);

    const filteredAndSortedTasks = useMemo(() => {
        const dayAhead = 10; // TODO: make this customizable by user or maybe make this global constant
        const today = new Date();
        const warningDate = new Date().setDate(today.getDate() + dayAhead);

        let filteringTasks = processingTasks;

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

        let finalFiltered = filteringTasks;
        return finalFiltered;
    },
        [lnw_task]
    );

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    function openCreateTaskModal() { setIsCreateTaskModalOpen(true); };
    function closeCreateTaskModal() { setIsCreateTaskModalOpen(false); };

    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    function openTaskDetailModal() { setIsTaskDetailModalOpen(true); };
    function closeTaskDetailModal() { setIsTaskDetailModalOpen(false); };

    const [isTaskDetailDealerModalOpen, setIsTaskDetailDealerModalOpen] = useState(false);
    function openTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(true); };
    function closeTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(false); };

    const [taskRowData, setTaskRowData] = useState<DOMStringMap>(); // for sending task detail of selected row to task modals

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    console.log("filteredAndSortedTasks = = = = = == = = =");
    console.log(filteredAndSortedTasks);
    return (
        <>
            <CreateTaskModal isOpen={isCreateTaskModalOpen} onClose={() => { closeCreateTaskModal() }} currentProjectID={currentProjectID} parentUpdateCallback={fetchData} />
            <TaskDetailModal isOpen={isTaskDetailModalOpen} onClose={() => { closeTaskDetailModal() }} />
            <TaskDetailDealerModal isOpen={isTaskDetailDealerModalOpen} onClose={() => { closeTaskDetailDealerModal() }} taskData={taskRowData} currentProjectName={currentProjectName} />

            <h1>{currentProjectID}</h1> {/* // TODO: remove this */}
            <h1>{currentProjectName}</h1> {/* // TODO: remove this */}
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
                        {currentProjectID ? (
                            <button
                                onClick={openCreateTaskModal}
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
                                        data-task-team={task.team.teamName}
                                        data-selected-task={JSON.stringify(task)} // TODO: SUPER LOW IQ SOLUTION: JUST TAKE ALL ROW DATA, TURN IT TO JSON STRING, THROW TO MODAL AND PARSE THE SHEESH THERE LOLLLLLLLLLLLLLLL
                                        onClick={(e) => {
                                            const rowData = e.currentTarget.dataset;
                                            setTaskRowData(rowData);
                                            // TODO: should compare by teamID but this works for now
                                            if (rowData.taskTeam === "DEALER") openTaskDetailDealerModal();
                                            else openTaskDetailModal();
                                        }}
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
                                            {getDateYYYY_MM_DD(task.deadline)}
                                        </td>
                                        <td
                                            className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate"
                                            title={task.taskName.taskNameID}
                                        >
                                            {task.taskName.taskNameStr}
                                        </td>
                                        <td
                                            className="px-6 py-4 text-gray-600 max-w-sm truncate"
                                            title={task.logPreview} // TODO: maybe title is not need?
                                        >
                                            {task.logPreview + " / " + task.projectID}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                                {task.team.teamName}
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
                                            // TODO:  make statuscolor index by statusid?
                                            className={`px-6 py-4 font-semibold ${StatusColor.get(task.status.statusName) || "text-gray-500"}`}
                                        >
                                            {task.status.statusName}
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

                            {/* // TODO: show row when no task in project */}
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

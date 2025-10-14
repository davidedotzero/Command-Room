import { StatusColor } from "../../../utils/constants";
import { formatDateYYYY_MM_DD } from "../../../utils/functions";
import type { FilteringTask } from "../../../utils/types";
import AssigneeLabels from "../../utils/AssigneeLabels";

function TableDisplay(
    { filteredAndSortedTasks, setTaskRowData, openTaskDetailDealerModal, openTaskDetailProductionModal }:
        {
            filteredAndSortedTasks: FilteringTask[],
            setTaskRowData: React.Dispatch<React.SetStateAction<FilteringTask | null>>,
            openTaskDetailDealerModal: () => void,
            openTaskDetailProductionModal: () => void,
        }) {

    return (
        <>
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
                                Team
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium text-left">
                                Worker
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium text-left">
                                Help Assignee
                            </th>
                            {/* <th scope="col" className="px-6 py-3 font-medium text-left"> */}
                            {/*     Help Details */}
                            {/* </th> */}
                            <th scope="col" className="px-6 py-3 font-medium text-left">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium text-left">
                                Project Name
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAndSortedTasks.map((task) => {
                            {/* // [✅ เพิ่ม] ตรวจสอบสิทธิ์การแก้ไข */ }
                            {/* const userCanEdit = canEditTask(user, task); */ }
                            {/* const isSelected = selectedTaskIds.has(task._id); */ }

                            {/* const userCanEdit = true; // TODO: implement bulk edit later */ }
                            return (
                                <tr key={task.taskID} className={`hover:bg-orange-50 cursor-pointer ${task.taskStatusID === 3 ? "bg-purple-200" : "bg-white"}`} // highlight help me row
                                    data-selected-task={JSON.stringify(task)} // TODO: SUPER LOW IQ SOLUTION: JUST TAKE ALL ROW DATA, TURN IT TO JSON STRING, THROW TO MODAL AND PARSE THE SHEESH THERE LOLLLLLLLLLLLLLLL
                                    title={task.taskID}
                                    onClick={(e) => {
                                        // const rowData = e.currentTarget.dataset;
                                        setTaskRowData(task);

                                        // TODO: should compare by teamID but this works for now
                                        if (task.teamName === "DEALER") {
                                            openTaskDetailDealerModal();
                                            console.log("yes");
                                        } else {
                                            openTaskDetailProductionModal();
                                            console.log("no");
                                        }
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
                                        {formatDateYYYY_MM_DD(task.deadline)}
                                    </td>
                                    <td
                                        className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate"
                                        title={task.taskName}
                                    >
                                        {task.taskName}
                                    </td>
                                    <td
                                        className="px-6 py-4 text-gray-600 max-w-sm truncate"
                                        title={task.logPreview} // TODO: maybe title is not need?
                                    >
                                        {task.logPreview}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                            {task.teamName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        {
                                            task.workers === null ? "-" : task.workers.map(x => { return <AssigneeLabels key={x.userID} text={x.userName} /> })
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-medium">
                                        {/* {task.HelpAssignee || "-"} */}
                                        {task.teamHelpID ? task.teamHelpName : "-"}
                                    </td>
                                    {/* <td */}
                                    {/*     className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" */}
                                    {/* // title={task.HelpDetails || undefined} */}
                                    {/* > */}
                                    {/* {truncateText(task.HelpDetails, 10)} */}
                                    {/*     {"help detail PLACEHOLDER"} */}
                                    {/* </td> */}
                                    <td
                                        // TODO:  make statuscolor index by statusid?
                                        className={`px-6 py-4 font-semibold ${StatusColor.get(task.taskStatusName) || "text-gray-500"}`}
                                    >
                                        {task.taskStatusName}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" >
                                        {task.projectName}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* // TODO: say loading when loading, no row when no row, select project first when no project */}
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
        </>
    );
}

export default TableDisplay;

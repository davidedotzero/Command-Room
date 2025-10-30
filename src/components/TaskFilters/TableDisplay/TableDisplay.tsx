import { StatusColor } from "../../../utils/constants";
import { formatDateYYYY_MM_DD } from "../../../utils/functions";
import type { FilteringTask } from "../../../types/types";
import AssigneeLabels from "../../utils/AssigneeLabels";
import TeamLabel from "../../utils/TeamLabels";

function TableDisplay(
    { filteredAndSortedTasks, setTaskRowData, openTaskDetailDealerModal, openTaskDetailProductionModal, hideProjNameColumn }:
        {
            filteredAndSortedTasks: FilteringTask[],
            setTaskRowData: React.Dispatch<React.SetStateAction<FilteringTask | null>>,
            openTaskDetailDealerModal: () => void,
            openTaskDetailProductionModal: () => void,
            hideProjNameColumn?: boolean
        }) {

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm table-auto">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-sm md:max-w-md">
                                Deadline
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-[50] md:max-w-md">
                                Task
                            </th>
                            <th scope="col" className={`px-1 md:px-6 py-3 font-medium text-left max-w-[50] md:max-w-md ${hideProjNameColumn ? "hidden" : ""}`}>
                                Project Name
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-md truncate">
                                Note/Result
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-sm truncate">
                                Team
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-md truncate">
                                Worker
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-sm truncate">
                                Help Assignee
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-[10] truncate">
                                <span className="md:truncate"> {"Recent Update (4hrs)"} </span>
                            </th>
                            <th scope="col" className="px-1 md:px-6 py-3 font-medium text-left max-w-sm">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAndSortedTasks.map((task) => {
                            return (
                                <tr
                                    key={task.taskID}
                                    className={`cursor-pointer ${task.taskStatusID === 3 ? "bg-purple-200 hover:bg-purple-100" : "bg-white hover:bg-orange-50"}`} // highlight help me row
                                    data-selected-task={JSON.stringify(task)} // TODO: SUPER LOW IQ SOLUTION: JUST TAKE ALL ROW DATA, TURN IT TO JSON STRING, THROW TO MODAL AND PARSE THE SHEESH THERE LOLLLLLLLLLLLLLLL
                                    title={task.taskID}
                                    onClick={(e) => {
                                        // const rowData = e.currentTarget.dataset;
                                        setTaskRowData(task);

                                        // TODO: should compare by teamID but this works for now
                                        // BUG: DEALERS NOT DEALER
                                        if (task.teamName === "DEALER") {
                                            openTaskDetailDealerModal();
                                            console.log("yes");
                                        } else {
                                            openTaskDetailProductionModal();
                                            console.log("no");
                                        }
                                    }}
                                >
                                    <td className="px-1 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateYYYY_MM_DD(task.deadline)}
                                    </td>
                                    <td
                                        className="px-1 md:px-6 py-4 font-medium text-gray-900"
                                        title={task.taskName}
                                    >
                                        {task.taskName}
                                    </td>
                                    <td className={`px-1 md:px-6 py-4 font-medium text-gray-900 ${hideProjNameColumn ? "hidden" : ""}`}
                                        title={task.projectName}
                                    >
                                        {task.projectName}
                                    </td>
                                    <td
                                        className="px-1 md:px-6 py-4 text-gray-600"
                                        title={task.logPreview} // TODO: maybe title is not need?
                                    >
                                        {task.logPreview}
                                    </td>
                                    <td className="px-1 md:px-6 py-4"
                                        title={task.teamName}
                                    >
                                        <TeamLabel text={task.teamName} />
                                    </td>
                                    <td className="px-1 md:px-6 py-4">
                                        {
                                            task.workers === null ? "-" : task.workers.map(x => { return <AssigneeLabels key={x.userID} text={x.userName} /> })
                                        }
                                    </td>
                                    <td className="px-1 md:px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-medium">
                                        {task.teamHelpID ? task.teamHelpName : "-"}
                                    </td>
                                    <td
                                        className="px-1 md:px-6 py-4 font-medium text-green-600"
                                        title={task.recentLogsCount.toString()}
                                    >
                                        {task.recentLogsCount <= 0 ? "" : task.recentLogsCount}
                                    </td>
                                    <td
                                        // TODO:  make statuscolor index by statusid?
                                        className={`px-1 md:px-6 py-4 font-semibold ${StatusColor.get(task.taskStatusName) || "text-gray-500"}`}
                                    >
                                        {task.taskStatusName}
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
            </div >
        </>
    );
}

export default TableDisplay;

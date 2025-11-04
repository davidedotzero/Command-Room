import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { PlusIcon } from "../components/utils/icons";

import type { Team, FilteringTask } from "../types/types.tsx";

import TaskDetailProductionModal from "../components/modals/TaskDetailProductionModal";
import TaskDetailDealerModal from "../components/modals/TaskDetailDealerModal";
import CreateTaskModal from "../components/modals/tasks/CreateTaskModal.tsx";
import { API } from "../utils/api";
import KPISummarySection from "../components/TaskFilters/KPISummarySection/KPISummarySection";
import FieldFiltersAndAdd from "../components/TaskFilters/FieldFiltersAndAdd/FieldFiltersAndAdd";
import TableDisplay from "../components/TaskFilters/TableDisplay/TableDisplay";
import { filterTasks } from "../functions/TaskFilters/filters";
import { filteredByKPITasks } from "../functions/TaskFilters/KPIfilters";
import FullscreenSpinner from "../components/Spinners/FullscreenSpinner";
import LegacyCreateTaskModal from "../components/modals/Legacy/LegacyCreateTaskModal.tsx";

// TODO: fix re-renders on open CreateTaskModal!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function ProjectDetail() {
    let param = useParams();
    if (!param.projectID) {
        // TODO: better error page
        return <p>NO PROJECT SELECTED</p>;
    }

    const currentProjectID: string = param.projectID; // TODO: should i pass this as props or urlParams?
    const [currentProjectName, setCurrentProjectName] = useState<string>("");

    const [tasksByProjectIDDetailed, setTasksByProjectIDDetailed] = useState<FilteringTask[]>([]); // TODO: rename this
    const [taskRowData, setTaskRowData] = useState<FilteringTask | null>(null); // for sending task detail of selected row to task modals

    const [isLoading, setIsLoading] = useState(true);
    const [validID, setValidID] = useState(true);

    const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
    const [teamIDFilter, setTeamIDFilter] = useState<number | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
    const [showOnlyIncompleteChecked, setShowOnlyIncompleteChecked] = useState<boolean>(true);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const [projectName, data] = await Promise.all([
                API.getProjectNameById(currentProjectID),
                API.getTasksByProjectIdDetailed(currentProjectID),
            ])

            setTasksByProjectIDDetailed(data);
            setCurrentProjectName(projectName);

            setValidID(true);
        } catch (error) {
            setValidID(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    // TODO: separate filtering tasks to multiple steps so we can useMemo separately
    // 1. filter by kpi
    // 2. filter by team
    // 3. filter by taskname, note
    // const tasksFilteredByKPI: FilteringTask[] = useMemo(() => {
    //
    // }, [tasksByProjectIDDetailed, activeStatFilter]);

    // const filteredAndSortedTasks: FilteringTask[] = filterTasks(tasksByProjectIDDetailed, activeStatFilter, teamIDFilter, searchFilter, startDateFilter, endDateFilter);
    const filteredTasks: FilteringTask[] = filterTasks(tasksByProjectIDDetailed, teamIDFilter, searchFilter, startDateFilter, endDateFilter, showOnlyIncompleteChecked);
    const eiei: FilteringTask[] = filteredByKPITasks(filteredTasks, activeStatFilter); // TODO: rename this

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    function openCreateTaskModal() { setIsCreateTaskModalOpen(true); };
    function closeCreateTaskModal() { setIsCreateTaskModalOpen(false); };

    const [isTaskDetailProductionModalOpen, setIsTaskDetailProductionModalOpen] = useState(false);
    function openTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(true); };
    function closeTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(false); };

    const [isTaskDetailDealerModalOpen, setIsTaskDetailDealerModalOpen] = useState(false);
    function openTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(true); };
    function closeTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(false); };


    if (isLoading) {
        return <FullscreenSpinner />
    }

    if (!validID) {
        return (
            // TODO: better message
            <h1 className="text-9xl text-red-500">NOPE</h1>
        )
    }

    return (
        <>
            <LegacyCreateTaskModal isOpen={isCreateTaskModalOpen} onClose={() => { closeCreateTaskModal() }} currentProjectID={currentProjectID} parentUpdateCallback={fetchData} />
            <TaskDetailProductionModal isOpen={isTaskDetailProductionModalOpen} onClose={() => { closeTaskDetailProductionModal() }} taskData={taskRowData} parentUpdateCallback={fetchData} />
            <TaskDetailDealerModal isOpen={isTaskDetailDealerModalOpen} onClose={() => { closeTaskDetailDealerModal() }} taskData={taskRowData} currentProjectName={currentProjectName} parentUpdateCallback={fetchData} />

            <h1 className="text-2xl font-bold text-gray-800"> {currentProjectName}</h1> {/* // TODO: remove this */}
            <h1 className="text-2sm text-gray-800 mb-6"> {currentProjectID}</h1> {/* // TODO: remove this */}
            <div className="space-y-6">
                {/*  TODO: split to separate components */}
                <KPISummarySection title={"สรุปสถานะ Task ของโปรเจกต์นี้"} activeStatFilterState={[activeStatFilter, setActiveStatFilter]} tasks={filteredTasks} refreshDataCallback={fetchData} />
                <FieldFiltersAndAdd
                    teamIDFilterState={[teamIDFilter, setTeamIDFilter]}
                    searchFilterState={[searchFilter, setSearchFilter]}
                    startDateFilterState={[startDateFilter, setStartDateFilter]}
                    endDateFilterState={[endDateFilter, setEndDateFilter]}
                    showOnlyIncompleteCheckedState={[showOnlyIncompleteChecked, setShowOnlyIncompleteChecked]}
                    tasksLength={eiei.length}
                    createNewTaskButton={
                        (
                            <button
                                onClick={openCreateTaskModal}
                                className="flex items-center px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span className="ml-2">เพิ่ม Task</span>
                            </button>
                        )
                    } />
                <TableDisplay hideProjNameColumn={true} filteredAndSortedTasks={eiei} setTaskRowData={setTaskRowData} openTaskDetailDealerModal={openTaskDetailDealerModal} openTaskDetailProductionModal={openTaskDetailProductionModal} />
            </div>
        </>
    );
}

export default ProjectDetail;

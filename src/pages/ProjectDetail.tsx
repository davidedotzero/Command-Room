import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { PlusIcon } from "../components/utils/icons";

import type { Team, FilteringTask } from "../utils/types";

import TaskDetailProductionModal from "../components/modals/TaskDetailProductionModal";
import TaskDetailDealerModal from "../components/modals/TaskDetailDealerModal";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import { API } from "../utils/api";
import { AssigneeLabels } from "../components/utils/AssigneeLabels";
import KPISummarySection from "../components/TaskFilters/KPISummarySection/KPISummarySection";
import FieldFiltersAndAdd from "../components/TaskFilters/FieldFiltersAndAdd/FieldFiltersAndAdd";
import TableDisplay from "../components/TaskFilters/TableDisplay/TableDisplay";
import { useFilteredTasks } from "../functions/TaskFilters/filters";

// TODO: fix re-renders on open CreateTaskModal!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function ProjectDetail() {
    let param = useParams();
    if (!param.projectID) {
        // TODO: better error page
        return <p>NO PROJECT SELECTED</p>;
    }

    const currentProjectID: string = param.projectID; // TODO: should i pass this as props or urlParams?
    let isCurrentProjectIDValid: boolean = false;
    const [currentProjectName, setCurrentProjectName] = useState<string>("");

    const [tasksByProjectIDDetailed, setTasksByProjectIDDetailed] = useState<FilteringTask[]>([]); // TODO: rename this
    const [lnw_team, setLnw_team] = useState<Team[]>([]); // TODO: rename this
    const [taskRowData, setTaskRowData] = useState<DOMStringMap>(); // for sending task detail of selected row to task modals

    const [isLoading, setIsLoading] = useState(true);

    const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
    const [teamIDFilter, setTeamIDFilter] = useState<number | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const fetchData = async () => {
        setIsLoading(true);
        const data = await API.getTasksByProjectIdDetailed(currentProjectID);
        const projectName = await API.getProjectNameById(currentProjectID);
        const teams = await API.getAllTeams();
        isCurrentProjectIDValid = await API.isProjectIDExists(currentProjectID);

        setTasksByProjectIDDetailed(data);
        setCurrentProjectName(projectName);
        setLnw_team(teams);

        setIsLoading(false);
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

    const filteredAndSortedTasks: FilteringTask[] = useFilteredTasks(tasksByProjectIDDetailed, activeStatFilter, teamIDFilter, searchFilter);

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
        return <div>
            Loading...
        </div>
    }

    return (
        <>
            <CreateTaskModal isOpen={isCreateTaskModalOpen} onClose={() => { closeCreateTaskModal() }} currentProjectID={currentProjectID} parentUpdateCallback={fetchData} />
            <TaskDetailProductionModal isOpen={isTaskDetailProductionModalOpen} onClose={() => { closeTaskDetailProductionModal() }} taskData={taskRowData} currentProjectName={currentProjectName} parentUpdateCallback={fetchData} />
            <TaskDetailDealerModal isOpen={isTaskDetailDealerModalOpen} onClose={() => { closeTaskDetailDealerModal() }} taskData={taskRowData} currentProjectName={currentProjectName} parentUpdateCallback={fetchData} />

            <h1 className="text-2xl font-bold text-gray-800"> {currentProjectName}</h1> {/* // TODO: remove this */}
            <h1 className="text-2sm text-gray-800 mb-6"> {currentProjectID}</h1> {/* // TODO: remove this */}
            <div className="space-y-6">
                {/*  TODO: split to separate components */}
                <KPISummarySection activeStatFilterState={[activeStatFilter, setActiveStatFilter]} tasks={tasksByProjectIDDetailed} />
                <FieldFiltersAndAdd teamIDFilterState={[teamIDFilter, setTeamIDFilter]} searchFilterState={[searchFilter, setSearchFilter]} teamNameList={lnw_team} tasksLength={filteredAndSortedTasks.length}
                    createNewTaskButton={
                        isCurrentProjectIDValid ? (
                            <button
                                onClick={openCreateTaskModal}
                                className="flex items-center px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span className="ml-2">เพิ่ม Task</span>
                            </button>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                (เลือกโปรเจกต์เพื่อเพิ่ม Task)
                            </div>
                        )
                    } />
                <TableDisplay filteredAndSortedTasks={filteredAndSortedTasks} setTaskRowData={setTaskRowData} openTaskDetailDealerModal={openTaskDetailDealerModal} openTaskDetailProductionModal={openTaskDetailProductionModal} />
            </div>
        </>
    );
}

export default ProjectDetail;

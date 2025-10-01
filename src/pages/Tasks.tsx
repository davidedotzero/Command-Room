import { useEffect, useState } from "react";
import TaskDetailProductionModal from "../components/modals/TaskDetailProductionModal";
import TaskDetailDealerModal from "../components/modals/TaskDetailDealerModal";
import type { FilteringTask, Team } from "../utils/types";
import { useFilteredTasks } from "../functions/TaskFilters/filters";
import { API } from "../utils/api";
import KPISummarySection from "../components/TaskFilters/KPISummarySection/KPISummarySection";
import FieldFiltersAndAdd from "../components/TaskFilters/FieldFiltersAndAdd/FieldFiltersAndAdd";
import TableDisplay from "../components/TaskFilters/TableDisplay/TableDisplay";

function Tasks() {
    const [allTasks, setAllTasks] = useState<FilteringTask[]>([]); // TODO: rename this
    const [lnw_team, setLnw_team] = useState<Team[]>([]); // TODO: rename this
    const [taskRowData, setTaskRowData] = useState<DOMStringMap>(); // for sending task detail of selected row to task modals
    const [isLoading, setIsLoading] = useState(true);

    const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
    const [teamIDFilter, setTeamIDFilter] = useState<number | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const fetchData = async () => {
        setIsLoading(true);
        const data = await API.getAllTasksDetailed();
        const teams = await API.getAllTeams();

        setAllTasks(data);
        setLnw_team(teams);

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    // const filteredAndSortedTasks: FilteringTask[] = useFilteredTasks(allTasks, activeStatFilter, teamIDFilter, searchFilter);

    const [isTaskDetailProductionModalOpen, setIsTaskDetailProductionModalOpen] = useState(false);
    function openTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(true); };
    function closeTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(false); };

    const [isTaskDetailDealerModalOpen, setIsTaskDetailDealerModalOpen] = useState(false);
    function openTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(true); };
    function closeTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(false); };

    return (
        <>
            {/* <TaskDetailProductionModal isOpen={isTaskDetailProductionModalOpen} onClose={() => { closeTaskDetailProductionModal() }} taskData={taskRowData} currentProjectName={"PLACEHOLDER-NO PROJECTNAME"} parentUpdateCallback={fetchData} /> */}
            {/* <TaskDetailDealerModal isOpen={isTaskDetailDealerModalOpen} onClose={() => { closeTaskDetailDealerModal() }} taskData={taskRowData} currentProjectName={"PLACEHOLDER-NO PROJECTNAME"} parentUpdateCallback={fetchData} /> */}

            <div className="space-y-6">
                {/*  TODO: split to separate components */}
                <KPISummarySection activeStatFilterState={[activeStatFilter, setActiveStatFilter]} tasks={filteredAndSortedTasks} />
                <FieldFiltersAndAdd teamIDFilterState={[teamIDFilter, setTeamIDFilter]} searchFilterState={[searchFilter, setSearchFilter]} teamNameList={lnw_team} />
                <TableDisplay filteredAndSortedTasks={filteredAndSortedTasks} setTaskRowData={setTaskRowData} openTaskDetailDealerModal={openTaskDetailDealerModal} openTaskDetailProductionModal={openTaskDetailProductionModal} />
            </div>
        </>
    );
}

export default Tasks;

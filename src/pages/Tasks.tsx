import { useEffect, useState } from "react";
import TaskDetailProductionModal from "../components/modals/TaskDetailProductionModal";
import TaskDetailDealerModal from "../components/modals/TaskDetailDealerModal";
import type { FilteringTask, Team } from "../utils/types";
import { useFilteredTasks } from "../functions/TaskFilters/filters";
import { API } from "../utils/api";
import KPISummarySection from "../components/TaskFilters/KPISummarySection/KPISummarySection";
import FieldFiltersAndAdd from "../components/TaskFilters/FieldFiltersAndAdd/FieldFiltersAndAdd";
import TableDisplay from "../components/TaskFilters/TableDisplay/TableDisplay";
import { useAuth } from "../contexts/AuthContext";

function Tasks() {
    const [allTasks, setAllTasks] = useState<FilteringTask[]>([]); // TODO: rename this
    const [lnw_team, setLnw_team] = useState<Team[]>([]); // TODO: rename this
    const [taskRowData, setTaskRowData] = useState<FilteringTask | null>(null); // for sending task detail of selected row to task modals
    const [avgHelpLeadDays, setAvgHelpLeadDays] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
    const [teamIDFilter, setTeamIDFilter] = useState<number | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [projectFilter, setProjectFilter] = useState<string | null>("");
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

    const { user } = useAuth();

    const fetchData = async () => {
        setIsLoading(true);
        let data = null;
        if (user?.isAdmin) {
            data = await API.getAllTasksDetailed();
        } else {
            // TODO: handle user undefined
            console.log(user.userID);
            data = await API.getTasksByUserIdDetailed(user!.userID);
        }
        const teams = await API.getAllTeams();
        const avgHelp = await API.getAvgHelpLeadDaysBeforeDeadline();

        setAllTasks(data);
        setLnw_team(teams);
        setAvgHelpLeadDays(Number(avgHelp));

        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAndSortedTasks: FilteringTask[] = useFilteredTasks(allTasks, activeStatFilter, teamIDFilter, searchFilter, startDateFilter, endDateFilter, projectFilter);

    const [isTaskDetailProductionModalOpen, setIsTaskDetailProductionModalOpen] = useState(false);
    function openTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(true); };
    function closeTaskDetailProductionModal() { setIsTaskDetailProductionModalOpen(false); };

    const [isTaskDetailDealerModalOpen, setIsTaskDetailDealerModalOpen] = useState(false);
    function openTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(true); };
    function closeTaskDetailDealerModal() { setIsTaskDetailDealerModalOpen(false); };

    // let filteredAndSortedTasks: FilteringTask[] = [
    //     { taskID: "lnw", taskNameID: 1, teamID: 1, statusID: 1, projectID: "asd", deadline: new Date("2025-10-1"), logPreview: "1234", teamHelpID: null, helpReqAt: null, team: { teamID: 1, teamName: "eiei" }, status: { statusID: 1, statusName: "eiei" }, taskName: { taskNameID: 1, taskNameStr: "eiei" }, teamHelp: { teamID: 1, teamName: "192" } }
    // ];

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    return (
        <>
            <TaskDetailProductionModal isOpen={isTaskDetailProductionModalOpen} onClose={() => { closeTaskDetailProductionModal() }} taskData={taskRowData} parentUpdateCallback={fetchData} />
            <TaskDetailDealerModal isOpen={isTaskDetailDealerModalOpen} onClose={() => { closeTaskDetailDealerModal() }} taskData={taskRowData} currentProjectName={"PLACEHOLDER-NO PROJECTNAME"} parentUpdateCallback={fetchData} />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard & Global Filters
            </h1>
            <div className="space-y-6">
                <KPISummarySection title={"สรุปสถานะ Task ทั้งหมด"} activeStatFilterState={[activeStatFilter, setActiveStatFilter]} tasks={filteredAndSortedTasks} avgHelpLeadDays={avgHelpLeadDays} />
                <FieldFiltersAndAdd
                    teamIDFilterState={[teamIDFilter, setTeamIDFilter]}
                    searchFilterState={[searchFilter, setSearchFilter]}
                    projectIDFilterState={[projectFilter, setProjectFilter]}
                    startDateFilterState={[startDateFilter, setStartDateFilter]}
                    endDateFilterState={[endDateFilter, setEndDateFilter]}
                    tasksLength={filteredAndSortedTasks.length} />
                <TableDisplay filteredAndSortedTasks={filteredAndSortedTasks} setTaskRowData={setTaskRowData} openTaskDetailDealerModal={openTaskDetailDealerModal} openTaskDetailProductionModal={openTaskDetailProductionModal} />
            </div>
        </>
    );
}

export default Tasks;

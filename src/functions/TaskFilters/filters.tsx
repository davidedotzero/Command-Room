import { useMemo } from "react";
import type { FilteringTask } from "../../types/types";
import { getOnlyDate } from "../../utils/functions";

export function filterTasks(
    tasksDetailed: FilteringTask[],
    teamIDFilter: number | null,
    searchFilter: string,
    startDateFilter: Date | null,
    endDateFilter: Date | null,
    showOnlyIncompleteChecked: boolean,
    projectFilter?: string | null,
) {
    const filteredAndSortedTasks: FilteringTask[] = useMemo(() => {
        let filteringTasks = tasksDetailed;

        if (showOnlyIncompleteChecked) {
            // TODO: use enum here
            filteringTasks = filteringTasks.filter(t => t.taskStatusID != 2);
        }

        if (teamIDFilter) {
            filteringTasks = filteringTasks.filter((t) => t.teamID === Number(teamIDFilter) || t.teamHelpID === (Number(teamIDFilter)));
        }

        if (searchFilter) {
            let lowerSearchFilter = searchFilter.toLowerCase();
            filteringTasks = filteringTasks.filter((t) =>
                t.taskName.toLowerCase().includes(lowerSearchFilter) ||
                t.logPreview?.toLowerCase().includes(lowerSearchFilter) // TODO: should be search on full log but this will do for now
            );
        }

        if (projectFilter) {
            filteringTasks = filteringTasks.filter((t) => t.projectID === projectFilter);
        }

        if (startDateFilter) {
            filteringTasks = filteringTasks.filter((t) => getOnlyDate(t.deadline) >= getOnlyDate(startDateFilter));
        }

        if (endDateFilter) {
            filteringTasks = filteringTasks.filter((t) => getOnlyDate(t.deadline) <= getOnlyDate(endDateFilter));
        }

        filteringTasks.sort((a: FilteringTask, b: FilteringTask) => +a.deadline - +b.deadline); // using unary "+" operator here to "cast" deadline(Date) to timestamp(number)

        return filteringTasks;
    },
        [tasksDetailed, teamIDFilter, searchFilter, projectFilter, startDateFilter, endDateFilter, showOnlyIncompleteChecked]
    );

    return filteredAndSortedTasks;
}

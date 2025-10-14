import { useMemo } from "react";
import type { FilteringTask } from "../../utils/types";
import { getOnlyDate } from "../../utils/functions";

export function useFilteredTasks(
    tasksDetailed: FilteringTask[],
    activeStatFilter: string | null,
    teamIDFilter: number | null,
    searchFilter: string,
    startDateFilter: Date | null,
    endDateFilter: Date | null,
    projectFilter?: string | null,
) {
    const filteredAndSortedTasks: FilteringTask[] = useMemo(() => {
        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // getDate +DAY_AHEAD day(s) from now LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        let filteringTasks = tasksDetailed;

        if (activeStatFilter) {
            const incomplete = filteringTasks.filter(
                // TODO: remove cancelled condition
                (t) => t.taskStatusName !== "Done" && t.taskStatusName !== "Cancelled"
            );
            switch (activeStatFilter) {
                case "Overdue":
                    filteringTasks = incomplete.filter((t) => t.deadline && t.deadline < getOnlyDate(TODAY));
                    break;
                case "Warning":
                    filteringTasks = incomplete.filter((t) => {
                        return t.deadline >= TODAY && t.deadline <= getOnlyDate(WARNING_DATE);
                    });
                    break;
                case "Incomplete":
                    filteringTasks = incomplete;
                    break;
                case "Done":
                    filteringTasks = filteringTasks.filter((t) => t.taskStatusName === "Done");
                    break;
                case "Help Me":
                    filteringTasks = filteringTasks.filter((t) => t.taskStatusName === "Help Me");
                    break;
                default:
                    console.error("PROJECTDETIAL KPI FILTERING UNREACHABLE");
            }
            console.log("overdue filteringtask");
            console.log(filteringTasks);
        }

        if (teamIDFilter) {
            filteringTasks = filteringTasks.filter((t) => t.teamID === Number(teamIDFilter) || t.teamHelpID === (Number(teamIDFilter)));
        }

        if (searchFilter) {
            let lowerSearchFilter = searchFilter.toLowerCase();
            filteringTasks = filteringTasks.filter((t) =>
                t.taskName.toLowerCase().includes(lowerSearchFilter) ||
                t.logPreview.toLowerCase().includes(lowerSearchFilter) // TODO: should be search on full log but this will do for now
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
        [tasksDetailed, activeStatFilter, teamIDFilter, searchFilter, projectFilter, startDateFilter, endDateFilter]
    );

    return filteredAndSortedTasks;
}

import { useMemo } from "react";
import type { FilteringTask } from "../../utils/types";

export function useFilteredTasks(tasksDetailed: FilteringTask[], activeStatFilter: string | null, teamIDFilter: number | null, searchFilter: string) {
    const filteredAndSortedTasks: FilteringTask[] = useMemo(() => {
        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // getDate +DAY_AHEAD day(s) from now LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        let filteringTasks = tasksDetailed;

        if (activeStatFilter) {
            const incomplete = filteringTasks.filter(
                // TODO: remove cancelled condition
                (t) => t.status.statusName !== "Done" && t.status.statusName !== "Cancelled"
            );
            switch (activeStatFilter) {
                case "Overdue":
                    filteringTasks = incomplete.filter((t) => t.deadline && t.deadline < TODAY);
                    break;
                case "Warning":
                    filteringTasks = incomplete.filter((t) => {
                        return t.deadline >= TODAY && t.deadline <= WARNING_DATE
                    });
                    break;
                case "Incomplete":
                    filteringTasks = incomplete;
                    break;
                case "Done":
                    filteringTasks = filteringTasks.filter((t) => t.status.statusName === "Done");
                    break;
                case "Help Me":
                    filteringTasks = filteringTasks.filter((t) => t.status.statusName === "Help Me");
                    break;
                default:
                    console.error("PROJECTDETIAL KPI FILTERING UNREACHABLE");
            }
        }

        if (teamIDFilter) {
            filteringTasks = filteringTasks.filter((t) => t.teamID === Number(teamIDFilter) || t.teamHelpID === (Number(teamIDFilter)));
        }

        if (searchFilter) {
            let lowerSearchFilter = searchFilter.toLowerCase();
            filteringTasks = filteringTasks.filter((t) =>
                t.taskName.taskNameStr.toLowerCase().includes(lowerSearchFilter) ||
                t.logPreview.toLowerCase().includes(lowerSearchFilter) // TODO: should be search on full log but this will do for now
            );
        }

        filteringTasks.sort((a: FilteringTask, b: FilteringTask) => +a.deadline - +b.deadline); // using unary "+" operator here to "cast" deadline(Date) to timestamp(number)

        return filteringTasks;
    },
        [tasksDetailed, activeStatFilter, teamIDFilter, searchFilter]
    );

    return filteredAndSortedTasks;
}

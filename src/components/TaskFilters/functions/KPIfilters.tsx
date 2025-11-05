import { useMemo } from "react";
import type { FilteringTask } from "../../../types/types";
import { getOnlyDate } from "../../../utils/functions";

export function filteredByKPITasks(
    filteredTasks: FilteringTask[],
    activeStatFilter: string | null,
) {
    const filterByKPI: FilteringTask[] = useMemo(() => {
        let filteringTasks = filteredTasks;

        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // getDate +DAY_AHEAD day(s) from now LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

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
                    console.log("filter ========");
                    filteringTasks = incomplete.filter((t) => {
                        return t.deadline >= getOnlyDate(TODAY) && t.deadline <= getOnlyDate(WARNING_DATE);
                    });
                    console.log(filteringTasks);
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
        }

        return filteringTasks;
    },
        [filteredTasks, activeStatFilter]
    );

    return filterByKPI;
}

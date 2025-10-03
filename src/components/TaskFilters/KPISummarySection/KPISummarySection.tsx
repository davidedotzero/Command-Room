import { useMemo } from "react";
import type { FilteringTask } from "../../../utils/types";
import StatDisplayCard from "./StatDisplayCard";
import { RefreshIcon } from "../../utils/icons";

const statDescriptions = {
    overdue: "งานที่ยังไม่เสร็จและเลยกำหนดส่งแล้ว",
    warning: "งานที่ยังไม่เสร็จและใกล้ถึงกำหนดส่งใน 10 วัน",
    incomplete: "งานทั้งหมดที่ยังต้องดำเนินการ (สถานะไม่ใช่ 'เสร็จสิ้น' หรือ 'ยกเลิก')",
    done: "งานทั้งหมดที่มีสถานะ 'เสร็จสิ้น'",
    helpMe: "งานที่ทีมกำลังร้องขอความช่วยเหลือ",
};

function KPISummarySection({ activeStatFilterState, tasks, avgHelpLeadDays, title }: { activeStatFilterState: [string | null, React.Dispatch<React.SetStateAction<string | null>>], tasks: FilteringTask[], avgHelpLeadDays?: number, title: string }) {
    const [activeStatFilter, setActiveStatFilter] = activeStatFilterState;

    const toggleActiveStatFilter = (stat: string) => {
        setActiveStatFilter(activeStatFilter === stat ? null : stat);
    }

    const statusMetrics = useMemo(() => {
        const DAY_AHEAD: number = 10; // TODO: make this customizable by user or maybe make this global constant
        const TODAY: Date = new Date();
        const WARNING_DATE: Date = new Date(new Date().setDate(TODAY.getDate() + DAY_AHEAD)); // LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

        let overdue = 0, warning = 0, incomplete = 0, done = 0, helpme = 0;
        tasks.forEach(task => {
            // TODO: rewrite this counting logic
            if (task.deadline && task.deadline < TODAY) overdue += 1;

            if (task.deadline >= TODAY && task.deadline <= WARNING_DATE && task.status.statusName !== "Done") {
                warning += 1;
            }

            if (task.status.statusName !== "Done") incomplete += 1;
            if (task.status.statusName === "Help Me") helpme += 1;
            if (task.status.statusName === "Done") done += 1;
        });

        return { overdue, warning, incomplete, done, helpme }
    }, [tasks]);

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-bold text-gray-700">
                        {title}
                    </h3>
                    <button
                        // onClick={refreshAllData} TODO: make refresh data work
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-full transition-colors"
                        aria-label="Refresh data"
                    >
                        <RefreshIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatDisplayCard
                        label="Overdue"
                        value={statusMetrics.overdue}
                        color="text-red-500"
                        isActive={activeStatFilter === "Overdue"}
                        onClick={() => toggleActiveStatFilter("Overdue")}
                        description={statDescriptions.overdue}
                    />
                    <StatDisplayCard
                        label="Warning"
                        value={statusMetrics.warning}
                        color="text-yellow-500"
                        isActive={activeStatFilter === "Warning"}
                        onClick={() => toggleActiveStatFilter("Warning")}
                        description={statDescriptions.warning}
                    />
                    <StatDisplayCard
                        label="Incomplete"
                        value={statusMetrics.incomplete}
                        color="text-blue-500"
                        isActive={activeStatFilter === "Incomplete"}
                        onClick={() => toggleActiveStatFilter("Incomplete")}
                        description={statDescriptions.incomplete}
                    />
                    <StatDisplayCard
                        label="Done"
                        value={statusMetrics.done}
                        color="text-green-500"
                        isActive={activeStatFilter === "Done"}
                        onClick={() => toggleActiveStatFilter("Done")}
                        description={statDescriptions.done}
                    />
                    <StatDisplayCard
                        label="Help Me"
                        value={statusMetrics.helpme}
                        color="text-purple-500"
                        isActive={activeStatFilter === "Help Me"}
                        onClick={() => toggleActiveStatFilter("Help Me")}
                        description={statDescriptions.helpMe}
                    />
                </div>
                {
                    avgHelpLeadDays && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">
                                    ระยะเวลาเฉลี่ยที่ขอความช่วยเหลือก่อน Deadline:
                                </span>
                                <span className="ml-2 font-bold text-lg text-gray-800">
                                    {avgHelpLeadDays}
                                </span>
                                <span className="ml-1 text-sm text-gray-600">วัน</span>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default KPISummarySection;

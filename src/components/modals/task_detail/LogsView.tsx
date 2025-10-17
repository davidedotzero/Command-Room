import { useEffect, useState } from "react";
import { DetailItem } from "../forms/FormItems";
import { API } from "../../../utils/api";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import { formatDateYYYY_MM_DD } from "../../../utils/functions";
import type { EditLogDetailed } from "../../../utils/types";
import { CopyIcon } from "../../utils/icons";

function LogsView({ taskID }: { taskID: string }) {
    const { TASK_STATUSES } = useDbConst();

    // const [taskLogs, setTaskLogs] = useState("Loading...");
    const [taskLogs, setTaskLogs] = useState<EditLogDetailed[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
        setIsLoading(false);
    }, [])

    const fetchData = async () => {
        const response = await API.getLogsByTaskIdDesc(taskID);
        if (!response || response.length <= 0) {
            return;
        }

        setTaskLogs(response);
    };


    async function handleCopyLog(id: string) {
        const copyingLog = taskLogs.find(x => x.eLogID === id);
        if (!copyingLog) {
            // TODO: better alert
            console.error("id not found in list????");
            return;
        }

        if (!copyingLog.reason) {
            // TODO: better alert
            console.error("reason not found????");
            return;
        }

        try {
            await navigator.clipboard.writeText(copyingLog.reason);
            // TODO: better alert
            console.log('HTML content copied to clipboard!');

        } catch (err) {
            // TODO: better alert
            console.error('Failed to copy HTML: ', err);
        }
    }

    return (
        <>
            {isLoading ? "Loading..." :
                taskLogs.length <= 0 || taskLogs === null ?
                    (
                        <div className="w-full flex justify-center items-center italic text-gray-500">
                            {"ไม่พบ log ใน task นี้"}
                        </div>
                    ) :
                    <DetailItem label="Notes / Result (Log)">
                        <div className="space-y-2">
                            {
                                taskLogs.map(x => {
                                    let displayLog = "";

                                    displayLog += `--- อัปเดตเมื่อ ${x.date === null ? "N/A" : x.date.toLocaleString("en-CA", { timeZone: "Asia/Bangkok", hour12: false })} โดย ${x.userName === null || x.userID === "USER-0000-000000" ? "N/A" : x.userName}---\n`

                                    if (x.fromDeadline && x.toDeadline) displayLog += `* เปลี่ยน Deadline: ${formatDateYYYY_MM_DD(x.fromDeadline!)} -> ${formatDateYYYY_MM_DD(x.toDeadline)} \"\n`
                                    if (x.fromStatusID && x.toStatusID) displayLog += `* เปลี่ยน Status: ${TASK_STATUSES.find(t => t.taskStatusID === x.fromStatusID)?.taskStatusName} -> ${TASK_STATUSES.find(t => t.taskStatusID === x.toStatusID)?.taskStatusName}\n`
                                    displayLog += `รายละเอียด / เหตุผล: ${x.reason}\n`

                                    return (
                                        <div className="p-3 bg-gray-50 rounded-md border min-h-[100px] max-h-[500px] whitespace-pre-wrap disabled overflow-y-scroll relative">
                                            <div className="absolute top-0 right-0 m-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyLog(x.eLogID);
                                                    }}
                                                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 active:bg-blue-50"
                                                    aria-label="คัดลอก Log"
                                                    title="คัดลอก Log"
                                                >
                                                    <CopyIcon />
                                                </button>
                                            </div>
                                            {displayLog}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </DetailItem>
            }
        </>
    );
}
export default LogsView;

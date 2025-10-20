import { useEffect, useMemo, useState } from "react";
import { DetailItem } from "../forms/FormItems";
import { API } from "../../../utils/api";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import { formatDateYYYY_MM_DD, getOnlyDate, testDelay } from "../../../utils/functions";
import type { EditLogDetailed } from "../../../utils/types";
import { CopyIcon } from "../../utils/icons";
import InlineSpinner from "../../Spinners/InlineSpinner";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useEffectDatePickerFix } from "../../utils/ReactDatePickerBodgeFixHook";

function LogsView({ taskID }: { taskID: string }) {
    const { TASK_STATUSES } = useDbConst();

    // const [taskLogs, setTaskLogs] = useState("Loading...");
    const [taskLogs, setTaskLogs] = useState<EditLogDetailed[]>([]);

    const [startDateFilter, setStartDateFilter] = useState<Date | null>();
    const [endDateFilter, setEndDateFilter] = useState<Date | null>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    useEffectDatePickerFix([isLoading]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        const response = await API.getLogsByTaskIdDesc(taskID);
        await testDelay(50)
        // if (!response || response.length <= 0) {
        //     return;
        // }

        setTaskLogs(response);
        setIsLoading(false);
    };


    const filteredLogs: EditLogDetailed[] = useMemo(() => {
        if (!taskLogs) {
            return taskLogs;
        }

        let filteringLogs = taskLogs;

        if (startDateFilter) {
            filteringLogs = filteringLogs.filter((t) => getOnlyDate(t.date) >= getOnlyDate(startDateFilter));
        }

        if (endDateFilter) {
            filteringLogs = filteringLogs.filter((t) => getOnlyDate(t.date) <= getOnlyDate(endDateFilter));
        }

        return filteringLogs;
    }, [taskLogs, startDateFilter, endDateFilter]);


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
            Swal.fire({
                text: "คัดลอกลงคลิปบอร์ดแล้ว",
                position: "bottom-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: '!rounded-md !border !border-blue-500 !bg-blue-200 !text-blue-900'
                },
                showClass: {
                    popup: 'none'
                },
                hideClass: {
                    popup: 'swal2-hide'
                },
                didOpen: (toast) => {
                    toast.addEventListener('click', Swal.close);
                }
            });
        } catch (err) {
            Swal.fire({
                text: "คัดลอกลงคลิปบอร์ดผิดพลาด",
                position: "bottom-end",
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: '!rounded-md !border !border-red-500 !bg-red-200 !text-red-900'
                },
                showClass: {
                    popup: 'none'
                },
                hideClass: {
                    popup: 'swal2-hide'
                },
                didOpen: (toast) => {
                    toast.addEventListener('click', Swal.close);
                }
            });
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading) {
            timer = setTimeout(() => {
                setShowSpinner(true);
            }, 200);
        } else {
            // @ts-expect-error
            clearTimeout(timer);
            setShowSpinner(false);
        }

        return () => {
            clearTimeout(timer);
        }
    }, [isLoading]);

    if (showSpinner) {
        return <InlineSpinner />
    }

    if (!isLoading) {
        if (taskLogs.length <= 0 || taskLogs === null) {
            return (
                <div className="w-full flex justify-center items-center italic text-gray-500">
                    {"ไม่พบ log ใน task นี้"}
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDateFilter}
                            onChange={(date) => setStartDateFilter(date)}
                            filterDate={(date) => { return date.getDay() !== 0 }}
                            isClearable={true}
                            placeholderText={"เลือก deadline เริ่มต้น"}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDateFilter}
                            onChange={(date) => setEndDateFilter(date)}
                            filterDate={(date) => { return date.getDay() !== 0 }}
                            isClearable={true}
                            placeholderText={"เลือก deadline สิ้นสุด"}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                {
                    <DetailItem label="Notes / Result (Log)">
                        <div className="space-y-2">
                            {
                                filteredLogs.map(x => {
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
                        </div >
                    </DetailItem >
                }
            </>
        );
    }
}
export default LogsView;

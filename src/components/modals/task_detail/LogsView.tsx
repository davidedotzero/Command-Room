import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { DetailItem } from "../forms/FormItems";
import { API } from "../../../utils/api";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import { formatDateYYYY_MM_DD } from "../../../utils/functions";
import type { EditLog, EditLogDetailed } from "../../../utils/types";
import { CopyIcon } from "../../utils/icons";
import InlineSpinner from "../../Spinners/InlineSpinner";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { useEffectDatePickerFix } from "../../utils/ReactDatePickerBodgeFixHook";
import { useAuth } from "../../../contexts/AuthContext";
import equal from "fast-deep-equal";

function LogsView({ taskID }: { taskID: string }) {
    const { TASK_STATUSES } = useDbConst();

    // const [taskLogs, setTaskLogs] = useState("Loading...");
    const [prevTaskLogs, setPrevTaskLogs] = useState<EditLogDetailed[]>([]);
    const [taskLogs, setTaskLogs] = useState<EditLogDetailed[]>([]);

    const [startDateFilter, setStartDateFilter] = useState<Date | null>();
    const [endDateFilter, setEndDateFilter] = useState<Date | null>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSaveLogBtn, setShowSaveLogBtn] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    useEffectDatePickerFix([isLoading]);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (taskLogs && taskLogs.length > 0) {
            let foo = taskLogs.map(x => { return { eLogID: x.eLogID, markedDone: Boolean(x.markedDone) } });
            let bar = prevTaskLogs.map(x => { return { eLogID: x.eLogID, markedDone: Boolean(x.markedDone) } });
            if (equal(foo, bar)) {
                setShowSaveLogBtn(false);
            } else {
                setShowSaveLogBtn(true);
            }
        }
    }, [taskLogs, prevTaskLogs])

    const fetchData = async () => {
        setIsLoading(true);
        const response = await API.getLogsByTaskIdDesc(taskID);
        // if (!response || response.length <= 0) {
        //     return;
        // }

        setPrevTaskLogs(response);
        setTaskLogs(response);
        setIsLoading(false);
    };

    const filteredLogs: EditLogDetailed[] = useMemo(() => {
        if (!taskLogs) {
            return taskLogs;
        }

        let filteringLogs = taskLogs;

        if (startDateFilter) {
            filteringLogs = filteringLogs.filter((t) => (t.date) >= (startDateFilter));
        }

        if (endDateFilter) {
            filteringLogs = filteringLogs.filter((t) => (t.date) <= (endDateFilter));
        }

        return filteringLogs;
    }, [taskLogs, startDateFilter, endDateFilter]);


    async function handleCopyLog(id: string) {
        const copyingLog = prevTaskLogs.find(x => x.eLogID === id);
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

    function handleLogDoneChange(e: ChangeEvent<HTMLInputElement>, logID: string) {
        setTaskLogs(currentState => {
            const newState = currentState.map(x => x.eLogID === logID ? { ...x, markedDone: e.target.checked } : x);
            return newState;
        });
    }

    async function handleSaveLogDone() {
        let foo = taskLogs.map(x => { return { eLogID: x.eLogID, markedDone: Boolean(x.markedDone) } });
        let bar = prevTaskLogs.map(x => { return { eLogID: x.eLogID, markedDone: Boolean(x.markedDone) } });
        if (equal(foo, bar)) {
            console.log("its the same bro");
            return;
        }

        let toUnmark: EditLog[] = [];
        if (prevTaskLogs) {
            for (let oldLog of prevTaskLogs) {
                if (taskLogs.find(x => x.eLogID === oldLog.eLogID && oldLog.markedDone && !x.markedDone)) {
                    toUnmark.push(oldLog);
                }
            }
        }

        let toMark: EditLog[] = [];
        if (taskLogs) {
            for (let newLog of taskLogs) {
                if (prevTaskLogs.find(x => x.eLogID === newLog.eLogID && !x.markedDone && newLog.markedDone)) {
                    toMark.push(newLog);
                }
            }
        }

        // console.log(toUnmark.map(x => x.eLogID));
        // console.log(toMark.map(x => x.eLogID));
        // if (toUnmark.length > 0) await API.unmarkLogs(toUnmark.map(x => x.eLogID));
        // if (toMark.length > 0) await API.markLogs(toMark.map(x => x.eLogID));

        // TODO: handle api properly
        const response = await API.markLogs(toMark.map(x => x.eLogID), toUnmark.map(x => x.eLogID));
        if (response.ok) {
            setPrevTaskLogs(taskLogs);
        } else {
            setTaskLogs(prevTaskLogs);
            console.log("not oke!");
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
        if (prevTaskLogs.length <= 0 || prevTaskLogs === null) {
            return (
                <div className="w-full flex justify-center items-center italic text-gray-500 mt-4">
                    {"ไม่พบ log ใน task นี้"}
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-2 gap-4 sticky top-0 z-50 bg-white p-4 shadow-md">
                    <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDateFilter}
                            onChange={(date) => setStartDateFilter(date)}
                            filterDate={(date) => { return date.getDay() !== 0 }}
                            isClearable={true}
                            placeholderText={"เลือกวันเริ่มต้น"}
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
                            placeholderText={"เลือกวันสิ้นสุด"}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>


                {
                    <>
                        <div className="p-4">
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
                                                <>
                                                    <div className={`p-3 rounded-md border relative ${x.markedDone ? "bg-green-200" : "bg-gray-50"}`} title={x.eLogID}>
                                                        <div className="top-0 right-0 m-1 absolute flex justify-end">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopyLog(x.eLogID);
                                                                }}
                                                                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 active:bg-blue-50 transition-colors hover:cursor-pointer"
                                                                aria-label="คัดลอก Log"
                                                                title="คัดลอก Log"
                                                            >
                                                                <CopyIcon />
                                                            </button>
                                                        </div>

                                                        {/* add user here for now */}
                                                        {user.userID === "USER-2025-000011" || user.userID === "USER-0000-000001" || user.userID === "USER-2025-000019" || user.userID === "USER-2025-000001" ?
                                                            <div className="bottom-0 right-0 mr-3 mb-1 absolute flex justify-end">
                                                                <label className="flex items-center space-x-3 cursor-pointer group">
                                                                    <input type="checkbox" className="sr-only peer" onChange={(e) => handleLogDoneChange(e, x.eLogID)} checked={x.markedDone} />
                                                                    <span className="bg-gray-100/40 p-2 rounded-md text-gray-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 peer-checked:hidden">ทำเครื่องหมายว่าเสร็จ</span>
                                                                    <span className="bg-gray-100/40 p-2 rounded-md text-gray-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 hidden peer-checked:block">ยกเลิกการเสร็จสิ้น</span>

                                                                    <div className="w-4 h-4 border-2 border-gray-400 rounded-sm peer-checked:bg-green-600 peer-checked:border-green-600">
                                                                        <svg
                                                                            className={`w-full h-full text-white opacity-0 peer-checked:opacity-100`}
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round">
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            : ""}

                                                        <div className="min-h-[100px] max-h-[500px] whitespace-pre-wrap disabled overflow-y-scroll">
                                                            {displayLog}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div >
                            </DetailItem >
                        </div>
                    </>
                }

                <div className="sticky bottom-0 flex items-center justify-end">
                    <button
                        onClick={handleSaveLogDone}
                        className={`m-4 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400 ${showSaveLogBtn ? "opacity-100" : "opacity-0"}`}
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </>
        );
    }
}
export default LogsView;

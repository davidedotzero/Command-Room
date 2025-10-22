import { useEffect, useState, type ReactElement } from "react";
import type { Project, Team } from "../../../utils/types";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import { API } from "../../../utils/api";
import DatePicker from "react-datepicker";
import { useEffectDatePickerFix } from "../../utils/ReactDatePickerBodgeFixHook";
import Select from "react-select";

function FieldFiltersAndAdd(
    { teamIDFilterState, searchFilterState, projectIDFilterState, startDateFilterState, endDateFilterState, showOnlyIncompleteCheckedState, createNewTaskButton, tasksLength }:
        {
            teamIDFilterState: [number | null, React.Dispatch<React.SetStateAction<number | null>>],
            searchFilterState: [string, React.Dispatch<React.SetStateAction<string>>],
            projectIDFilterState?: [string | null, React.Dispatch<React.SetStateAction<string | null>>],
            startDateFilterState: [Date | null, React.Dispatch<React.SetStateAction<Date | null>>],
            endDateFilterState: [Date | null, React.Dispatch<React.SetStateAction<Date | null>>],
            showOnlyIncompleteCheckedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
            createNewTaskButton?: ReactElement,
            tasksLength: number
        }) {

    const [teamIDFilter, setTeamIDFilter] = teamIDFilterState;
    const [searchFilter, setSearchFilter] = searchFilterState;
    const [projectIDFilter, setProjectIDFilter] = projectIDFilterState === undefined ? [null, null] : projectIDFilterState;
    const [startDateFilter, setStartDateFilter] = startDateFilterState;
    const [endDateFilter, setEndDateFilter] = endDateFilterState;

    // THIS IS VERY BAD AND I WILL HATE MYSELF FOREVER FOR IT. but we need this to handle react-select value props cuz i really dont wanna change projectIDFilter, teamIDFilter to accept both value and label
    const [projectName, setProjectName] = useState<string | null>();
    const [teamName, setTeamName] = useState<string | null>();

    const [showOnlyIncompleteChecked, setShowOnlyIncompleteChecked] = showOnlyIncompleteCheckedState;

    const { TEAMS } = useDbConst();
    const [projectList, setProjectList] = useState<Project[]>([]);

    useEffectDatePickerFix();

    const fetchData = async () => {
        // TODO: dont fetch archived project
        const res = await API.getAllProjects();
        setProjectList(res);
    }

    useEffect(() => {
        fetchData();
    }, [])

    function resetFilters() {
        setTeamIDFilter(null);
        setSearchFilter("");
        setStartDateFilter(null);
        setEndDateFilter(null);

        if (setProjectIDFilter) setProjectIDFilter(null);
    }

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-bold text-gray-700">
                        ตัวกรองและเครื่องมือ
                    </h3>
                    {createNewTaskButton}
                </div>
                <div className="grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* // TODO: abstract this to comboBox component or add this via prop children */}
                    <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Team / Assignee
                        </label>
                        <Select
                            isClearable
                            placeholder={"-- ทีมทั้งหมด --"}
                            value={teamIDFilter === null ? null : { value: teamIDFilter, label: teamName }}
                            onChange={(e) => {
                                if (!e) {
                                    setTeamIDFilter(null);
                                    setTeamName(null);
                                    return;
                                }
                                setTeamIDFilter(Number(e.value))
                                setTeamName(e.label)
                            }}
                            options={TEAMS.map(x => ({ value: x.teamID, label: x.teamName }))}
                            className="text-sm shadow-sm"
                        >
                        </Select>
                    </div>
                    {
                        projectIDFilterState && (
                            <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Project
                                </label>
                                <Select
                                    isClearable
                                    placeholder={"-- โปรเจกต์ทั้งหมด --"}
                                    value={projectIDFilter === null ? null : { value: projectIDFilter, label: projectName }}
                                    onChange={(e) => {
                                        if (!e) {
                                            if (setProjectIDFilter) setProjectIDFilter(null);
                                            setProjectName(null);
                                            return;
                                        }
                                        if (setProjectIDFilter) setProjectIDFilter(e.value);
                                        setProjectName(e.label);
                                    }}
                                    className="text-sm shadow-sm"
                                    options={projectList.map(x => ({ value: x.projectID, label: x.projectName }))}
                                >
                                </Select>
                            </div>
                        )
                    }
                    <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
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
                    <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
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
                    <div className="xs:col-span-1 sm:col-span-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            ค้นหา Task / Note
                        </label>
                        <input
                            type="text"
                            placeholder="ค้นหา..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)} // TODO: implement key bouncing
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div className="xs:col-span-1 sm:col-span-1 col-span-2 flex items-center">
                        <label className="text-lg font-medium text-gray-700">
                            <input type="checkbox" className="mr-1" checked={showOnlyIncompleteChecked} onChange={(e) => { setShowOnlyIncompleteChecked(e.target.checked) }} />
                            แสดงเฉพาะ Task ที่ยังไม่เสร็จ
                        </label>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <p className="text-lg font-semibold text-gray-800">
                        พบผลลัพธ์:{" "}
                        <span className="text-orange-500">{tasksLength}</span>{" "}
                        รายการ
                    </p>
                    <button
                        // TODO: resetFilters
                        onClick={() => {
                            resetFilters();
                        }}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 transition duration-150 disabled:opacity-40"
                    >
                        ล้างตัวกรองทั้งหมด
                    </button>
                </div>
            </div >
        </>
    )
}

export default FieldFiltersAndAdd;

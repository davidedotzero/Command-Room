import type { ReactElement } from "react";
import type { Team } from "../../../utils/types";

function FieldFiltersAndAdd(
    { teamIDFilterState, searchFilterState, teamNameList, createNewTaskButton, resetFiltersCallback, tasksLength }:
        {
            teamIDFilterState: [number | null, React.Dispatch<React.SetStateAction<number | null>>],
            searchFilterState: [string, React.Dispatch<React.SetStateAction<string>>],
            teamNameList: Team[],
            createNewTaskButton?: ReactElement,
            resetFilterCallback?: () => void,
            tasksLength: number
        }) {

    const [teamIDFilter, setTeamIDFilter] = teamIDFilterState;
    const [searchFilter, setSearchFilter] = searchFilterState;

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-bold text-gray-700">
                        ตัวกรองและเครื่องมือ
                    </h3>
                    {createNewTaskButton}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* // TODO: abstract this to comboBox component */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Team / Assignee
                        </label>
                        <select
                            onChange={(e) => setTeamIDFilter(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value={""}>-- ทีมทั้งหมด --</option>
                            {teamNameList.map((opt) => (
                                <option key={opt.teamID} value={opt.teamID}>
                                    {opt.teamName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
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
                </div>

                <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <p className="text-lg font-semibold text-gray-800">
                        พบผลลัพธ์:{" "}
                        <span className="text-orange-500">{tasksLength}</span>{" "}
                        รายการ
                    </p>
                    <button
                        onClick={() => {
                            // resetFilters();
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

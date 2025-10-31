import CreatableSelect from "react-select/creatable";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import type { DefaultTaskName } from "../../../types/types";
import type { SingleValue } from "react-select";

function DefaultTaskNamesSelect(
    { selectedTaskState, refEIEI, onChangeCallback }:
        { selectedTaskState: { value: DefaultTaskName | string, label: string } | null, onChangeCallback: (e: SingleValue<{ value: DefaultTaskName | string, label: string }>) => void, refEIEI?: any }
) {
    const { DEFAULT_TASK_NAMES } = useDbConst();

    return (
        <CreatableSelect
            className={"text-sm shadow-sm"}
            formatCreateLabel={(inputValue: string) => "สร้างชื่อ Task \"" + inputValue + "\" ใหม่"}
            required
            isClearable={true}
            isSearchable={true}
            placeholder={"กรอกชื่อ Task ใหม่หรือเลือกรายการจากที่มีอยู่..."}
            options={DEFAULT_TASK_NAMES.map(t => ({ value: t, label: t.taskName }))}
            value={selectedTaskState}
            onChange={e => onChangeCallback(e)}
            ref={refEIEI}
            onBlur={(e) => {
                if (!selectedTaskState && e.target.value)
                    onChangeCallback({ value: e.target.value, label: e.target.value })
            }}
            classNames={{
                control: (state) =>
                    state.isFocused ? "!outline-none !ring-orange-500 !border-orange-500 !ring-0" : "!border-gray-300"
            }}
        />
    );
}

export default DefaultTaskNamesSelect;

import CreatableSelect from "react-select/creatable";
import { useDbConst } from "../../../contexts/DbConstDataContext";
import type { DefaultTaskName } from "../../../utils/types";
import type { SingleValue } from "react-select";

function DefaultTaskNamesSelect(
    { selectedTaskState, refEIEI, onChangeCallback }:
        { selectedTaskState: { value: DefaultTaskName | string, label: string } | null, refEIEI: any, onChangeCallback: (e: SingleValue<{ value: DefaultTaskName | string, label: string }>) => void }
) {
    const { DEFAULT_TASK_NAMES } = useDbConst();

    return (
        <CreatableSelect
            className={"shadow-sm"}
            required
            isClearable={true}
            isSearchable={true}
            placeholder={"กรอกชื่อ Task ใหม่หรือเลือกรายการจากที่มีอยู่..."}
            options={DEFAULT_TASK_NAMES.map(t => ({ value: t, label: t.taskName }))}
            value={selectedTaskState}
            onChange={e => onChangeCallback(e)}
            ref={refEIEI}
        />
    );
}

export default DefaultTaskNamesSelect;

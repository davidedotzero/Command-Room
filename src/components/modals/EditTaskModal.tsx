import { createPortal } from "react-dom";
import { DetailItem, FormField } from "./forms/FormItems";

function EditTaskModal({ isOpen, onClose, taskData }: { isOpen: boolean, onClose: () => void, taskData: any }) {
    if (!isOpen) return null;

    // TODO: do proper isLoading later
    let isLoading = false;

    // because we pass it in as a json from TaskDetailXXXModal
    const currentTask = taskData;
    console.log("lnwjuanza + ");
    console.log(currentTask);

    const handleSubmit = (e: FormData) => {

    }

    // TODO: move this to a better place
    const baseInputClass =
        "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500";

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <header className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-800">
                            {"แก้ไข Task"}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-2xl"
                        >
                            &times;
                        </button>
                    </header>

                    <form action={handleSubmit} className="flex flex-col overflow-hidden flex-1 min-h-0">
                        <div className="p-8 space-y-8">
                            {/* === Section: รายละเอียดหลัก === */}
                            <div className="pb-6 border-b">
                                <div className="md:col-span-2 mb-6">
                                    <DetailItem label="Task">
                                        <p className="text-xl font-bold text-gray-800">{currentTask.taskName.taskNameStr || "-"}</p>
                                        {/* <strong>ของ Project:</strong> */}
                                        {/* <p>{props.currentProjectName}</p> */}
                                    </DetailItem>
                                </div>

                                <div className="overflow-y-auto flex-1">
                                    <FormField label="Deadline">
                                        <input
                                            type="date"
                                            name="Deadline"
                                            value={currentTask.deadline || ""}
                                            // onChange={handleChange}
                                            className={baseInputClass}
                                        />
                                    </FormField>

                                    <FormField label="Status">
                                        <select
                                            name="Status"
                                            value={currentTask.status.statusID}
                                            // onChange={handleChange}
                                            className={baseInputClass}
                                        >
                                            {statusOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </FormField>
                                </div>
                            </div>
                        </div>
                    </form>

                    <button onClick={onClose}>CLOSE</button>
                </div>
            </div>

        </>,
        document.getElementById("modal-root")!
    );
}

export default EditTaskModal;

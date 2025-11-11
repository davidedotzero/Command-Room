import { createPortal } from "react-dom";
import { CharCountInput, FormButton, FormField } from "./forms/FormItems";
import { useState, type ChangeEvent } from "react";
import { API } from "../../services/api";
import { ModalHeader } from "./ModalComponents";
import { useAuth } from "../../contexts/AuthContext";
import { NotificationType } from "../../types/types";

function EditProjectModal(
    { isOpen, onClose, selectedProjectID, selectedProjectName, parentUpdateCallback }:
        { isOpen: boolean, onClose: () => void, selectedProjectID: string | null, selectedProjectName: string | null, parentUpdateCallback: () => void }) {

    if (!isOpen) return null;
    if (!selectedProjectID || !selectedProjectName) return null; // TODO: handle error better

    const { user } = useAuth();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>(selectedProjectName);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
        if (e.target.value.trim() === '') {
            setIsDisabled(true);
            return;
        }

        setIsDisabled(false);
    }

    const handleSubmit = async () => {
        // TODO: confirmation dialog
        // TODO: dont send api if nothing has changed

        // TODO: better api error handling
        const res = await API.updateProjectNameById(selectedProjectID, projectName);
        API.notify_team_in_project(
            selectedProjectID,
            user?.userID!,
            NotificationType.PROJ_EDIT_NAME,
            `เปลี่ยนชื่อโปรเจกต์ - ${selectedProjectName} -> ${projectName}`,
            selectedProjectID
        );

        onClose();
        parentUpdateCallback();
    }

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <ModalHeader text={"แก้ไขโปรเจกต์"} onCloseCallback={onClose} isLoading={false} />

                    <div className="border-b p-6 flex">
                        <div className="flex-1 w-full">
                            <FormField label="ชื่อโปรเจกต์">
                                <CharCountInput
                                    maxLength={500}
                                    valueState={projectName}
                                    onChangeCallback={handleTextChange}
                                    inputClassName="min-w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </FormField >
                        </div>
                    </div>
                    <div className="p-6 flex justify-end items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            disabled={isDisabled}
                            className="ml-3 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!
    );
}

export default EditProjectModal;

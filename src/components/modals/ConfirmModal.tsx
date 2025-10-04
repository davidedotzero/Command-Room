import { createPortal } from "react-dom";

type DialogResult = "CONFIRM" | "CANCEL";
interface DialogTextsDisplay {
    dialogTitle: string,
    dialogDescription: string,
    btnCancelText: string,
    btnConfirmText: string
};

function ConfirmModal(
    {
        isOpen,
        onClose,
        texts = {
            dialogTitle: "DIALOG_TITLE",
            dialogDescription: "DIALOG_DESCRIPTION",
            btnCancelText: "BTN_CANCEL_TEXT",
            btnConfirmText: "BTN_CONFIRM_TEXT",
        },
        callback,
        result
    }: {
        isOpen: boolean,
        onClose: () => void,
        texts: DialogTextsDisplay,
        callback?: () => void,
        result?: DialogResult
    }) {

    if (!isOpen) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <div className="p-6">
                        <h1 className="text-2xl font-semibold break-words">{texts.dialogTitle}</h1>
                        <p className="break-words">{texts.dialogDescription}</p>
                    </div>
                    <div className="mt-2 flex justify-end bg-gray-100 p-3">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                            onClick={() => {
                                result = "CANCEL";
                                onClose();
                            }}
                        >
                            {texts.btnCancelText}
                        </button>
                        <button
                            className="ml-3 px-6 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={() => {
                                result = "CONFIRM"
                                if (callback) callback();
                                onClose();
                            }}
                        >
                            {texts.btnConfirmText}
                        </button>
                    </div>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!
    );
}

export default ConfirmModal;

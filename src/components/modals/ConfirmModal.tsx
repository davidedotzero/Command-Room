import { createPortal } from "react-dom";

type DialogResult = "CONFIRM" | "CANCEL";

function ConfirmModal({ isOpen, onClose, callback, result }: { isOpen: boolean, onClose: () => void, callback?: () => void, result?: DialogResult }) {
    if (!isOpen) return null;

    let dialogTitle = "EIEI";
    let dialogDescription = "asdjasdlasldksaldkajsldjadlajdlsajdlajdlakdjalsdjalsdjalkdjaldjsalkdjaldjaslkdjaslkdjasldjaslkdjakdjalkdjaldjaldjasldjsalkdjsalkdjadjakldajdlkajdlajdajkldalkjdalkjdaljdaljdskajdalkdjasldkajdklajsdlkasdjsalkdjalkdjaslkdjaklda";
    let btnCancelText = "cancel";
    let btnConfirmText = "confirm";

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <div className="p-6">
                        <h1 className="text-2xl font-semibold break-words">{dialogTitle}</h1>
                        <p className="break-words">{dialogDescription}</p>
                    </div>
                    <div className="mt-2 flex justify-end bg-gray-100 p-3">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                            onClick={() => {
                                result = "CANCEL";
                                onClose();
                            }}
                        >
                            {btnCancelText}
                        </button>
                        <button
                            className="ml-3 px-6 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={() => {
                                result = "CONFIRM"
                                if (callback) callback();
                                onClose();
                            }}
                        >
                            {btnConfirmText}
                        </button>
                    </div>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!
    );
}

export default ConfirmModal;

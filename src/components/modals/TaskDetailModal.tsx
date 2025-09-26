import { createPortal } from "react-dom";

function TaskDetailModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    // TODO: do proper isLoading later
    let isLoading = false;

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <button onClick={onClose}>CLOSEEEEEE</button>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                    <p>asdadlkadlsajldadjaldajsdalsdjl</p>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!, // this will always be not null so its safe uwu
    );
}

export default TaskDetailModal;

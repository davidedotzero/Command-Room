import { createPortal } from "react-dom";

function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                    <p>lnwjuanza</p>
                    <button onClick={onClose}>CLOSE</button>
                </div>
            </div >
        </>,
        document.getElementById("modal-root")!
    );
}

export default CreateProjectModal;

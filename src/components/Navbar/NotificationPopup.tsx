import { createPortal } from "react-dom";

function NotificationPopup({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;

    return createPortal
        (
            <>
                <div className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto">
                </div>
            </>
            , document.getElementById("noti-popup-root")!
        );
}

export default NotificationPopup;

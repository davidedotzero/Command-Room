import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";

function NotificationPopup({ isOpen, onCloseCallback, ignoreRef }: { isOpen: boolean, onCloseCallback: () => void, ignoreRef: RefObject<HTMLElement | null> }) {
    const popupRef = useRef<HTMLDivElement | null>(null);
    // useOutsideClick(popupRef, onCloseCallback, ignoreRef);

    // clicking outside popup
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (ignoreRef && ignoreRef.current && ignoreRef.current.contains(target)) {
                return;
            }

            if (popupRef && popupRef.current && !popupRef.current.contains(target)) {
                onCloseCallback();
            }
        }
        document.addEventListener('mousedown', handleClick);

        // this is so fucking dumb but it works so fuck it
        if (!isOpen) {
            document.removeEventListener('mousedown', handleClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, [popupRef, onCloseCallback, ignoreRef, isOpen])

    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {

    }

    if (!isOpen) return null;
    return createPortal
        (
            <>
                <div
                    ref={popupRef}
                    className="fixed top-17 right-6 w-120 min-h-[20vh] max-h-[90vh] z-50 p-3 bg-gray-100 border border-gray-200 rounded-md shadow-lg overflow-y-auto">
                </div>
            </>
            , document.getElementById("noti-popup-root")!
        );
}

export default NotificationPopup;

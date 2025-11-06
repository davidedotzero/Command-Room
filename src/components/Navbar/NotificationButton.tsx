import { useCallback, useEffect, useRef, useState } from "react";
import { BellIcon } from "../miscs/icons";
import NotificationPopup from "./NotificationPopup";
import { API } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function NotificationButton() {
    const { user } = useAuth();

    const bellButtonRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [unseenCount, setUnseenCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, [unseenCount]);

    async function fetchData() {
        const data = await API.getUserNotiUnseenCount(user?.userID!);
        setUnseenCount(data.unseenCount);
    }

    async function openPopup() {
        setIsOpen(!isOpen);
        if (unseenCount > 0) {
            await API.setUserNotiSeenAll(user?.userID!);
        }
        setUnseenCount(0);
    }

    return (
        <>
            <NotificationPopup isOpen={isOpen} onCloseCallback={useCallback(() => { setIsOpen(false) }, [setIsOpen])} ignoreRef={bellButtonRef} />
            <button
                onClick={openPopup}
                className={`relative group`}
                ref={bellButtonRef}
            >
                <div
                    className={`flex items-center justify-center rounded-full p-4 text-gray-600 transition-colors duration-200 group-hover:bg-orange-100 group-hover:text-orange-600 group-hover:cursor-pointer`}
                >
                    <BellIcon />
                </div>
                <div className={`${unseenCount <= 0 && "hidden"}`}>
                    <span className={`absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full p-3 text-white bg-red-500 text-sm transition-colors duration-200 group-hover:bg-red-600`} >
                        {unseenCount}
                    </span>
                </div>
            </button>
        </>
    );
}

export default NotificationButton;

import { useCallback, useEffect, useRef, useState } from "react";
import { BellIcon } from "../miscs/icons";
import NotificationPopup from "./NotificationPopup";
import { API } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { usePusher } from "../../contexts/PusherContext";

function NotificationButton() {
    const { user } = useAuth();
    const pusher = usePusher();

    const bellButtonRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [unseenCount, setUnseenCount] = useState(0);

    const handleClose = useCallback(() => { setIsOpen(false) }, [setIsOpen]);

    useEffect(() => {
        if (!(pusher && user)) {
            return;
        }

        console.log("hello!");
        const private_user_channel = pusher.channel("private-user-" + user.userID);
        private_user_channel.bind("private-user-unseenCount-event", function(data: unknown) {
            setUnseenCount(data.unseenCount);
        });
    }, [pusher, user])

    useEffect(() => {
        fetchData();
        console.log("hello! 2");
    }, []);

    async function fetchData() {
        const data = await API.getUserNotiUnseenCount(user?.userID!);
        setUnseenCount(data.unseenCount);
    }

    async function openPopup() {
        setIsOpen(isOpen => !isOpen);
        if (unseenCount > 0) {
            await API.setUserNotiSeenAll(user?.userID!);
        }
        setUnseenCount(0);
    }

    if (!(pusher && user)) {
        return null;
    }

    return (
        <>
            <NotificationPopup isOpen={isOpen} onCloseCallback={handleClose} ignoreRef={bellButtonRef} />
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

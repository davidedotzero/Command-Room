import { useState } from "react";
import { BellIcon } from "../miscs/icons";
import NotificationPopup from "./NotificationPopup";

function NotificationButton() {
    const [isOpen, setIsOpen] = useState(false);
    let unseenCount = 10;
    return (
        <>
            <NotificationPopup isOpen={isOpen} />
            <button
                onClick={() => { setIsOpen(!isOpen); console.log(isOpen); }}
                className={`relative group`}
            >
                <div
                    className={`flex items-center justify-center rounded-full p-4 text-gray-600 transition-colors duration-200 group-hover:bg-gray-100 group-hover:text-gray-800`}
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

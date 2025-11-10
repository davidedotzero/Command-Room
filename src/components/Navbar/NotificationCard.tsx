import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { formatDateYYYY_MM_DD_HH_MM_SS } from "../../utils/functions";
import AssigneeLabels from "../miscs/AssigneeLabels";
import TeamLabel from "../miscs/TeamLabels";
import { API } from "../../services/api";
import { NotificationType } from "../../types/types";
import { useNavigate } from "react-router";

function notificationCardStyle(visited: boolean) {
    return visited ? "bg-white hover:bg-orange-100" : "bg-blue-200 hover:bg-blue-300";
}


function NotificationCard({ visited, senderName, senderTeamName, message, createdAt, notiID, linkTargetID, notificationTypeID }:
    { visited: boolean, senderName: string, senderTeamName: string, message: string, createdAt: Date, notiID: number, linkTargetID: string | null, notificationTypeID: NotificationType }) {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [_visited, setVisited] = useState(visited);

    async function handleClick() {
        if (linkTargetID !== null) {
            switch (notificationTypeID) {
                case NotificationType.PROJ_NEW:
                case NotificationType.PROJ_EDIT_NAME:
                    navigate(`/projects/p/${linkTargetID}`);
                    break;
                case NotificationType.TASK_UPDATE:
                    console.error("GO TO TASK MODAL NOT IMPLEMENTED YET");
                    break;
                default:
                    break;
            }
        }

        if (_visited) {
            return;
        }

        console.log(notiID, user?.userID);
        setVisited(true);
        await API.setUserNotiVisited(notiID, user?.userID);
    }

    return (
        <>
            <div
                title={notiID + ""}
                className={`${notificationCardStyle(_visited)} p-3 border border-gray-200 rounded-sm mt-0.5 shadow-sm transition-colors duration-200 hover:cursor-pointer`}
                onClick={handleClick}
            >
                <span><AssigneeLabels text={senderName} /> <TeamLabel text={senderTeamName} />{" ได้ทำการ "}</span>
                <p>{`${message}`}</p>
                <p className="text-sm text-gray-600">{formatDateYYYY_MM_DD_HH_MM_SS(createdAt)}</p>
            </div>
        </>
    );
}

export default NotificationCard;

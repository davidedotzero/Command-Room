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
                case NotificationType.TASK_UPDATE_GENERIC:
                case NotificationType.TASK_UPDATE_DEADLINE:
                case NotificationType.TASK_UPDATE_STATUS:
                case NotificationType.TASK_UPDATE_HELPREQ:
                case NotificationType.TASK_NEW:
                    console.error("GO TO TASK MODAL NOT IMPLEMENTED YET");
                    break;
                default:
                    console.error("UNHANDLED NOTIFICATIONTYPE: " + notificationTypeID);
                    break;
            }
        }

        if (_visited) { return; }

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
                <div className="space-y-2">
                    <div><AssigneeLabels text={senderName} /> <TeamLabel text={senderTeamName} />{" ได้ทำการ "}</div>
                    <p className="whitespace-pre-wrap">{`${message}`}</p>
                    <p className="text-sm text-gray-600">{formatDateYYYY_MM_DD_HH_MM_SS(createdAt)}</p>
                </div>
            </div>
        </>
    );
}

export default NotificationCard;

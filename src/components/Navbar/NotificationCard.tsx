import { formatDateYYYY_MM_DD_HH_MM_SS } from "../../utils/functions";
import AssigneeLabels from "../miscs/AssigneeLabels";
import TeamLabel from "../miscs/TeamLabels";

function notificationCardStyle(visited: boolean) {
    return visited ? "bg-white hover:bg-orange-100" : "bg-blue-200 hover:bg-blue-300";
}

function NotificationCard({ visited, senderName, senderTeamName, message, createdAt, notiID }:
    { visited: boolean, senderName: string, senderTeamName: string, message: string, createdAt: Date, notiID: number }) {
    return (
        <>
            <div title={notiID + ""} className={`${notificationCardStyle(visited)} p-3 border border-gray-200 rounded-sm mt-0.5 shadow-sm transition-colors duration-200`}>
                <span><AssigneeLabels text={senderName} /> <TeamLabel text={senderTeamName} />{" ได้ทำการ "}</span>
                <p>{`${message}`}</p>
                <p className="text-sm text-gray-600">{formatDateYYYY_MM_DD_HH_MM_SS(createdAt)}</p>
            </div>
        </>
    );
}

export default NotificationCard;

import { useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function UserDashboard() {
    let param = useParams();
    if (!param.userID) {
        // TODO: better error page
        return <p>NO USER SELECTED</p>;
    }

    const currentUserID: string = param.userID;
    const { user } = useAuth();

    if (!user?.isAdmin && (currentUserID !== user?.userID)) {
        return (
            <>
                <p className="text-9xl text-red-500">ฮั่นแน่ ไม่ให้ดูหรอก 😛😛😛</p>
            </>
        );
    }

    return (
        <>
            <marquee direction="right" scrollamount="500"><p className="text-9xl">ยังไม่เสร็จจ้าาาา</p></marquee>
        </>
    )
}

export default UserDashboard;

import { useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { API } from "../services/api";
import type { User } from "../types/types";

function UserDashboard() {
    let param = useParams();
    if (!param.userID) {
        // TODO: better error page
        return <p>NO USER SELECTED</p>;
    }

    const currentUserID: string = param.userID;
    const { user } = useAuth();

    const [userData, setUserData] = useState<User>();

    async function fetchData() {
        const userData = await API.getUserById(currentUserID);

        setUserData(userData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (!user?.isAdmin && (currentUserID !== user?.userID)) {
        return (
            <>
                <p className="text-9xl text-red-500">ฮั่นแน่ ไม่ให้ดูหรอก 😛😛😛</p>
            </>
        );
    }

    return (
        <>
            {/* {userData?.userID}<br /> */}
            {/* {userData?.userName}<br /> */}
            {/* {userData?.teamID}<br /> */}
            {/* {"user update log count: "}<br /> */}
            {/* {"user done before deadline: "}<br /> */}
            <marquee direction="right" scrollamount="100"><p className="text-9xl">ยังไม่เสร็จจ้าาาา</p></marquee>
        </>
    )
}

export default UserDashboard;

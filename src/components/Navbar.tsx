import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
    const nav_active_class = (isActive: boolean) =>
        `flex item-center rounded-md transition-colors duration-200 p-3
        ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`;

    const { user, logout } = useAuth();

    return (
        <>
            <nav className="flex gap-2 bg-white shadow-sm sticky top-0 w-screen flex-shrink-0 p-3 justify-between">
                <div className="flex flex-row gap-2">
                    <NavLink to="/tasks" className={({ isActive }) => nav_active_class(isActive)}> {"รายการทั้งหมด"} </NavLink>
                    <NavLink to="/projects" className={({ isActive }) => nav_active_class(isActive)}> {"โปรเจกต์"} </NavLink>
                    {/* <NavLink to="/customers" className={({ isActive }) => nav_active_class(isActive)}> {"ลูกค้า"} </NavLink> */}
                </div>

                <div className="flex flex-row gap-2">
                    {/* // TODO: prettier btn and logout confirmation */}
                    <div className="flex justify-center items-center">{user?.userName}</div>
                    <button className="border border-transparent rounded-md p-3 bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none " onClick={() => { logout() }}>Logout</button>
                </div>

                {/* // WARNING: dev button */}
                <div className="hidden">
                    <div className="flex flex-row">
                        <button className="p-3 text-white border border-transparent rounded-md bg-green-500 hover:bg-green-600 active:bg-black"
                            onClick={() => {
                                console.log("admin toggle");
                                localStorage.setItem("project-crm-user", JSON.stringify({ "userID": user?.userID, "name": user?.userName, "email": user?.email, "teamID": user?.teamID, "isAdmin": !user?.isAdmin }))
                                window.location.reload();
                            }}
                        >
                            DEV TEST TOGGLE admin
                        </button>
                    </div>
                </div>
            </nav >
            {/* // WARNING: dev button */}
            <div className="hidden">
                {
                    user?.isAdmin && (
                        <div className="bg-red-500 font-bold text-3xl flex items-center justify-center text-white p-5 flex-col">
                            <div>YOU ARE NOT SUPPOSED TO SEE THIS. PLEASE CONTACT DEVELOPER IMMEDIATELY.</div>
                            <div>DEV INFO: if you are seeing this, you're an admin.</div>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Navbar;

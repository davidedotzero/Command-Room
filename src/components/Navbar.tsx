import { NavLink } from "react-router";

function Navbar() {
    const nav_active_class = (isActive: boolean) => `flex item-center rounded-md transition-colors duration-200 ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`;

    return (
        <>
            <nav className="flex gap-2 bg-white shadow-sm sticky top-0 max-w-7xl flex-shrink-0">
                <NavLink to="/tasks" className={({ isActive }) => nav_active_class(isActive)}> TASKS </NavLink>
                <NavLink to="/projects" className={({ isActive }) => nav_active_class(isActive)}>PROJECTS</NavLink>
                <NavLink to="/customers" className={({ isActive }) => nav_active_class(isActive)}>CUSTOMERS</NavLink>
            </nav>
        </>
    );
}

export default Navbar;

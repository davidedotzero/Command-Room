import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { DeleteIcon, EditIcon } from "../components/utils/icons";

// TODO: abstract to type.tsx file
interface Project {
    projectID: string;
    name: string;
    priority: number;
}

function Projects() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // TODO: DELETE MOCKUP DATA
    const projects: Project[] = [
        { projectID: "PROJ-CRM-0001", name: "test1", priority: 1 },
        { projectID: "PROJ-CRM-0002", name: "test2", priority: 2 },
        { projectID: "PROJ-CRM-0003", name: "test3", priority: 3 },
        { projectID: "PROJ-CRM-0004", name: "test4", priority: 4 },
        { projectID: "PROJ-CRM-0005", name: "test5", priority: 2 },
        { projectID: "PROJ-CRM-0006", name: "test6", priority: 3 },
        { projectID: "PROJ-CRM-0007", name: "test7", priority: 4 },
        { projectID: "PROJ-CRM-0008", name: "test8", priority: 5 },
        { projectID: "PROJ-CRM-0009", name: "test9", priority: 1 },
        { projectID: "PROJ-CRM-0010", name: "test10", priority: 1 },
    ];

    const filteredProjects = useMemo(() => {
        if (!searchQuery) {
            return projects;
        }
        return projects.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const sortedProjects = useMemo(() => {
        return [...filteredProjects].sort((a, b) => a.priority - b.priority);
    }, [filteredProjects]);

    return (
        <>
            {/* // TODO: split these to each components */}

            <div className="space-y-8">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        โปรเจกต์ทั้งหมด ({sortedProjects.length})
                    </h1>
                    {/* // TODO: create project button enable only for admin role */}
                    <button
                        // onClick={openCreateProjectModal}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-150"
                    >
                        + สร้างโปรเจกต์
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col">
                        <label htmlFor="project-search" className="text-sm font-medium text-gray-700 mb-2">
                            ค้นหาโปรเจกต์
                        </label>
                        <input
                            id="project-search"
                            type="text"
                            placeholder="พิมพ์ชื่อโปรเจกต์ที่ต้องการค้นหา..."
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProjects.map((p) => (
                        <div
                            key={p.projectID}
                            className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => navigate(`/projects/p/${p.projectID}`)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-gray-800 flex-1 pr-4">
                                    {p.name}
                                </h3>
                                <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                                    Priority: {p.priority}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-500 font-mono">{p.projectID}</p>
                                {/* // TODO: only show edit and delete button for admin role */}
                                {(
                                    <div className="flex items-center space-x-1">
                                        <button
                                            // onClick={(e) => {
                                            //     e.stopPropagation();
                                            //     openEditProjectModal(p);
                                            // }}
                                            className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100"
                                            aria-label="Edit Project"
                                            title="Edit Project"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            // onClick={(e) => {
                                            // e.stopPropagation();
                                            // onDeleteProject(p);
                                            // }}
                                            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
                                            aria-label="Delete Project"
                                            title="Delete Project"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {sortedProjects.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm border">
                        ไม่พบโปรเจกต์ที่ตรงกับคำค้นหา
                    </div>
                )}
            </div>
        </>
    );
}

export default Projects;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { DeleteIcon, EditIcon } from "../components/utils/icons";
import type { Project } from "../utils/types";
import { API } from "../utils/api";
import CreateProjectModal from "../components/modals/projects/CreateProjectModal";
import EditProjectModal from "../components/modals/EditProjectModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useAuth } from "../contexts/AuthContext";

function Projects() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [projectsList, setProjectsList] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedProjectID, setSelectedProjectID] = useState<string | null>(null);
    const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);

    const { user } = useAuth();

    const fetchData = async () => {
        setIsLoading(true);
        const data = await API.getAllActiveProjects();
        setProjectsList(data);
        setIsLoading(false);
    }

    const deleteSelectedProject = async () => {
        setIsLoading(true);
        if (!selectedProjectID) {
            // TODO: better error handling
            console.error("NO PROJECT SELECTED FOR DELETION.");
            return;
        }

        const res = await API.deleteProjectById(selectedProjectID);
        console.log(res);
        fetchData();
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const filteredProjects = useMemo(() => {
        if (!searchQuery) {
            return projectsList;
        }

        return projectsList.filter(p =>
            p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projectsList, searchQuery]);

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState<boolean>(false);
    function openCreateProjectModal() { setIsCreateProjectModalOpen(true) }
    function closeCreateProjectModal() { setIsCreateProjectModalOpen(false) }

    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState<boolean>(false);
    function openEditProjectModal() { setIsEditProjectModalOpen(true) }
    function closeEditProjectModal() { setIsEditProjectModalOpen(false) }

    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState<boolean>(false);
    function openDeleteProjectModal() { setIsDeleteProjectModalOpen(true) }
    function closeDeleteProjectModal() { setIsDeleteProjectModalOpen(false) }

    // TODO: show only not done project (toggled by a checkbox or smth)

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }


    const deleteModalTexts = {
        dialogTitle: "ลบบ่",
        dialogDescription: "อย่าลบเลยๆๆๆๆๆๆๆๆๆๆ",
        btnCancelText: "ยกเลิก",
        btnConfirmText: "ยืนยันการลบ",
    };


    return (
        <>
            <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={closeCreateProjectModal} />
            <EditProjectModal isOpen={isEditProjectModalOpen} onClose={closeEditProjectModal} selectedProjectID={selectedProjectID} selectedProjectName={selectedProjectName} parentUpdateCallback={fetchData} />
            <ConfirmModal isOpen={isDeleteProjectModalOpen} onClose={closeDeleteProjectModal} callback={deleteSelectedProject} texts={deleteModalTexts} />
            {/* // TODO: separate these to each components */}

            <div className="space-y-8">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        โปรเจกต์ทั้งหมด ({filteredProjects.length})
                    </h1>
                    {/* // TODO: create project button enable only for admin role */}
                    <button
                        onClick={openCreateProjectModal}
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <div
                            key={p.projectID}
                            className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            onClick={() => navigate(`/projects/p/${p.projectID}`)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-gray-800 flex-1 pr-4">
                                    {p.projectName}
                                </h3>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-500 font-mono">{p.projectID}</p>
                                {user?.isAdmin && (
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditProjectModal();
                                                setSelectedProjectID(p.projectID);
                                                setSelectedProjectName(p.projectName);
                                            }}
                                            className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100"
                                            aria-label="Edit Project"
                                            title="Edit Project"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProjectID(p.projectID);
                                                openDeleteProjectModal();
                                            }}
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
                {filteredProjects.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm border">
                        ไม่พบโปรเจกต์ที่ตรงกับคำค้นหา
                    </div>
                )}
            </div>
        </>
    );
}

export default Projects;

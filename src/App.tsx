import { Navigate, Outlet, Route, Routes, useSearchParams } from 'react-router'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Customers from './pages/Customers'
import { useAuth } from './contexts/AuthContext'
import ProjectDetail from './pages/ProjectDetail'
import { version } from '../package.json'

import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from 'react'
import UserDashboard from './pages/UserDashboard'
import { usePusher } from './contexts/PusherContext'
import { InfoToast, NotificationToast } from './components/Swal2/CustomSwalCollection'

// TODO: abstract this to other file MAYBE
function LoginPage() {
    let errorMessage = null;

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">มิวสิค อาร์ม</h1>
                    <p className="text-gray-500 mb-8">Please sign in to continue</p>

                    <a href={import.meta.env.VITE_API_URL + "/auth/google"}>
                        <button
                            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            {/* // Google Icon */}
                            {/* // TODO: abstract this to separate icon folder */}
                            <svg viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#4285F4" d="M24 9.5c3.9 0 6.8 1.6 8.4 3.1l6.3-6.3C34.9 2.5 30.1 0 24 0 14.9 0 7.3 5.4 3 13.2l7.8 6C12.5 13.1 17.8 9.5 24 9.5z"></path>
                                <path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.3-.5-4.9H24v9.3h12.4c-.5 3-2.1 5.6-4.6 7.3l7.5 5.8c4.4-4 7-9.9 7-17.5z"></path>
                                <path fill="#FBBC05" d="M10.8 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6C1.1 16.2 0 20 0 24s1.1 7.8 3 11.2l7.8-5.9z"></path>
                                <path fill="#EA4335" d="M24 48c5.9 0 10.9-1.9 14.6-5.2l-7.5-5.8c-2 1.3-4.5 2.1-7.1 2.1-6.2 0-11.5-3.6-13.2-8.6l-7.8 6C7.3 42.6 14.9 48 24 48z"></path>
                            </svg>
                            <span className="ml-3 font-medium text-gray-700">Sign in with Google</span>
                        </button>
                    </a>

                    {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}

function AuthCallback() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            // TODO: proper error page
            console.error("no token in url?");
            return;
        }
        login(token);
    }, []);

    return <div>Loading...</div>
}

function ProtectedRoutes() {
    const { user } = useAuth();
    const token = localStorage.getItem("command-room-token");

    if (!user || !token) {
        return null;
    }

    return (
        <>
            {/* TODO: change to bg-gray-50 */}
            <div className="w-full flex flex-col h-screen bg-gray-100 font-sans">
                <Navbar />
                <main className="w-full p-4 md:p-8 overflow-y-auto flex-grow">
                    <Outlet />
                </main>
            </div >

            <div className="absolute bottom-0 left-0 m-3 p-2 border border-transparent rounded-md bg-white/30 text-gray-400 hover:bg-white hover:text-gray-600 transition-all">v{version}</div>

            {/* render modals here */}
            <div id="modal-root"></div>
            <div id="noti-popup-root"></div>
        </>
    );
}

function NotificationHandler() {
    const pusher = usePusher();
    const { user } = useAuth();

    useEffect(() => {
        if (!(pusher && user)) {
            return;
        }

        const notify_all_channel = pusher.channel("notify-all");
        const private_user_channel = pusher.channel("private-user-" + user.userID);
        const private_team_channel = pusher.channel("private-team-" + user.teamID);

        if (!notify_all_channel) {
            console.error("Pusher Channel with a name " + "notify-all" + " does not exist.");
            return;
        }
        if (!private_user_channel) {
            console.error("Pusher Channel with a name " + "private-user" + " does not exist.");
            return;
        }
        if (!private_team_channel) {
            console.error("Pusher Channel with a name " + "private-team" + " does not exist.");
            return;
        }

        notify_all_channel.bind("notify-all-toast-event", function(data: unknown) {
            NotificationToast(data.message);
        });
        private_user_channel.bind("private-user-event", function(data: unknown) {
            NotificationToast(data.message);
        });
        private_team_channel.bind("private-team-toast-event", function(data: unknown) {
            NotificationToast(data.message);
        });

        return () => {
            if (notify_all_channel) notify_all_channel.unbind_all();
            if (private_user_channel) private_user_channel.unbind_all();
            if (private_team_channel) private_team_channel.unbind_all();
        };

    }, [pusher, user]);

    return null;
}

// TODO: abstract this to other file MAYBE
function AppContent() {
    return (
        <>
            <NotificationHandler />
            <Routes>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/auth/callback" element={<AuthCallback />}></Route>
                <Route path="/whoru" element={<div className='m-3 text-7xl text-red-500'>ผู้ ใ ด๋ นิ</div>}></Route>

                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Navigate to="/tasks" />}></Route>
                    <Route path="/tasks" element={<Tasks />}></Route>
                    <Route path="/projects" element={<Projects />}></Route>
                    <Route path="/projects/p/:projectID" element={<ProjectDetail />}></Route>
                    <Route path="/dashboard/u/:userID" element={<UserDashboard />}></Route>
                    {/* <Route path="/dashboard/all"></Route> */}
                    <Route path="/customers" element={<Customers />}></Route>
                </Route>

                <Route path="*" element={<div>404 not found ;(</div>}></Route>
            </Routes>
        </>
    );
}

function App() {
    return <AppContent />
}
export default App

import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Customers from './pages/Customers'
import { useAuth } from './contexts/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'
import ProjectDetail from './pages/ProjectDetail'
import { version } from '../package.json'

import "react-datepicker/dist/react-datepicker.css";

// TODO: abstract this to other file MAYBE
function LoginPage() {
    const { login } = useAuth();
    let errorMessage = null;

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const googleResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                });
                const userInfo = await googleResponse.json();

                if (!userInfo.email) {
                    // TODO: better error message
                    throw new Error("OAuth userInfo response doesn't have \"email\" field for some reason. (probably not our fault????)");
                }

                await login(userInfo.email); // authorize email here

            } catch (err: any) {
                errorMessage = err.message;
            }
        },
        onError: () => {
            errorMessage = 'Google login failed. Please try again.';
        },
    });


    return (
        <>
            {/* // yoinked from p pat XDDDD */}
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">มิวสิค อาร์ม</h1>
                    <p className="text-gray-500 mb-8">Please sign in to continue</p>

                    <button
                        onClick={() => handleGoogleLogin()}
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

                    {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}

// TODO: abstract this to other file MAYBE
function AppContent() {
    return (
        <>
            {/* TODO: change to bg-gray-50 */}
            <div className="w-full flex flex-col h-screen bg-gray-100 font-sans">
                <Navbar />
                <main className="w-full p-4 md:p-8 overflow-y-auto flex-grow">
                    <Routes>
                        <Route path="/" element={<Navigate to="/tasks" />}></Route>
                        <Route path="/tasks" element={<Tasks />}></Route>
                        <Route path="/projects" element={<Projects />}></Route>
                        <Route path="/projects/p/:projectID" element={<ProjectDetail />}></Route>
                        <Route path="/customers" element={<Customers />}></Route>
                    </Routes>
                </main>
            </div >

            <div className="absolute bottom-0 left-0 m-3 p-2 border border-transparent rounded-md bg-white/30 text-gray-400 hover:bg-white hover:text-gray-600 transition-all">v{version}</div>

            {/* render modals here */}
            <div id="modal-root"></div>
        </>
    );
}

function App() {
    const { user, isLoading } = useAuth();

    //TODO: isLoading

    if (!user) {
        return <LoginPage />
    }

    return <AppContent />
}
export default App

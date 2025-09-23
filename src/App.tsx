import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import Customers from './pages/Customers'

// TODO: abstract this to other file
function LoginPage() {

}

// TODO: abstract this to other file
function AppContent() {

}

function App() {
    return (
        <>
            {/* TODO: change to bg-gray-50 */}
            <div className="w-full flex flex-col h-screen bg-gray-100 font-sans">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/tasks" />}></Route>
                        <Route path="/tasks" element={<Tasks />}></Route>
                        <Route path="/projects" element={<Projects />}></Route>
                        <Route path="/customers" element={<Customers />}></Route>
                    </Routes>
                </main>
            </div >
        </>
    )
}
export default App

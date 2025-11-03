import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { DbConstProvider } from './contexts/DbConstDataContext.tsx'
import { PusherProvider } from './contexts/PusherContext.tsx'

const GOOGLE_CLIENT_ID =
    "204454748483-qmf22ku4od938tvin5hm0ik2ch83v0ec.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <PusherProvider>
                    <DbConstProvider>
                        <App />
                    </DbConstProvider>
                </PusherProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)

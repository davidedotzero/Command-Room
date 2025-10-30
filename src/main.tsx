import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { DbConstProvider } from './contexts/DbConstDataContext.tsx'

const GOOGLE_CLIENT_ID =
    "204454748483-qmf22ku4od938tvin5hm0ik2ch83v0ec.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <DbConstProvider>
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <App />
                    </GoogleOAuthProvider>
                </DbConstProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)

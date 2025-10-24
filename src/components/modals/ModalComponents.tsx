import { type ReactNode } from "react";

export function ModalContainer({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-white/70 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col max-h-[90vh] min-h-[90vh]">
                    {children}
                </div>
            </div>
        </>
    );
}

export function ModalHeader({ text, onCloseCallback, isLoading }: { text: string, onCloseCallback: () => void, isLoading: boolean }) {
    return (
        <>
            <header className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">สร้าง Task ใหม่</h2>
                <button
                    onClick={onCloseCallback}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                    &times;
                </button>
            </header>
        </>
    );
}

export function ModalFooter({ cancelText, confirmText, onCloseCallback, onSubmitCallback, isLoading }: { cancelText: string, confirmText: string, onCloseCallback: () => void, onSubmitCallback: () => void, isLoading: boolean }) {
    return (
        <>
            <footer className="flex justify-end p-6 bg-gray-50 border-t rounded-b-xl" >
                <button
                    disabled={isLoading}
                    type="button"
                    onClick={onCloseCallback}
                    className="px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500">
                    {cancelText}
                </button>
                <button
                    disabled={isLoading}
                    type="button"
                    onClick={onSubmitCallback}
                    className="ml-3 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500">
                    {confirmText}
                </button>
            </footer >
        </>
    )
}

export function ModalContent({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="flex flex-grow overflow-y-auto">
                {children}
            </div>
        </>
    )
}

export function ModalLeft({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="w-1/3 flex flex-col">
                {children}
            </div>
        </>
    )
}

export function ModalRight({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="w-2/3 overflow-x-auto border-l p-4">
                {children}
            </div>
        </>
    )
}

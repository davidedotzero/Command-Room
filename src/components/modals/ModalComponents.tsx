import { type ReactNode } from "react";
import { XIcon } from "../utils/icons";

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

export function ModalSmallContainer({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-white/50 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
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
                <h2 className="text-xl font-bold text-gray-800">{text}</h2>
                <div
                    className={"group p-3 flex items-center justify-center w-4 h-4 rounded-full p-0.5 hover:bg-gray-300 transition-colors"}
                    onClick={onCloseCallback}
                >
                    <button
                        disabled={isLoading}
                        className="text-gray-400 group-hover:text-gray-600 disabled:opacity-30 text-lg group-hover:cursor-pointer transition-colors"
                    >
                        <XIcon />
                    </button>
                </div>
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
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50">
                    {cancelText}
                </button>
                <button
                    disabled={isLoading}
                    type="button"
                    onClick={onSubmitCallback}
                    className="ml-3 px-6 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none disabled:bg-gray-400">
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
            <div className="w-2/5 flex flex-col">
                {children}
            </div>
        </>
    )
}

export function ModalRight({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="w-3/5 overflow-x-auto border-l">
                {children}
            </div>
        </>
    )
}

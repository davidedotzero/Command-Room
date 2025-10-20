function FullscreenSpinner() {
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
                <div className="animate-spin h-12 w-12 border-4 border-gray-200 border-t-blue-500 rounded-full"></div>
            </div>
        </>
    );
}

export default FullscreenSpinner;

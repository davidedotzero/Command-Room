function InlineSpinner() {
    return (
        <>
            <div className="flex justify-center items-center w-full min-h-24">
                <div className="animate-spin h-8 w-8 border-4 border-gray-200 border-t-blue-500 rounded-full"></div>
            </div>
        </>
    )
}

export default InlineSpinner;

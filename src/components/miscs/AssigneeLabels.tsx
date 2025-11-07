import { XIcon } from "./icons";

function AssigneeLabels({ text, closeButton, closeButtonCallback }: { text: string | null, closeButton?: boolean, closeButtonCallback?: () => void }) {
    if (!text) {
        return <span>-</span>;
    }

    // const parts = text.split(/([@#]\w+)/g).filter((part) => part);
    return (
        <>
            <div className="inline-block gap-1 px-2 py-0.5 m-0.5 text-xs font-medium bg-green-100 rounded-full">
                <div className="flex flex-row">
                    <span className="flex text-green-800 mr-0.5" >
                        {"" + text}
                    </span>
                    <div
                        onClick={closeButtonCallback}
                        className={`${!closeButton && "hidden"} flex items-center justify-center w-4 h-4 rounded-full p-0.5 bg-green-50 hover:bg-red-300 transition-colors`}>
                        <XIcon />
                    </div>
                </div>
            </div >
        </>
    );
}

export default AssigneeLabels;

function TeamLabel({ text, closeButton, closeButtonCallback }: { text: string | null, closeButton?: boolean, closeButtonCallback?: () => void }) {
    if (!text) {
        return <span>-</span>;
    }

    return (
        <>
            <span className="px-2.5 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                {text}
            </span>
        </>
    );
}

export default TeamLabel;

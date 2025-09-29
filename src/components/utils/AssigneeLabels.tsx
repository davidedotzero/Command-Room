export const AssigneeLabels: React.FC<{ text: string | null | undefined }> = ({
    text,
}) => {
    if (!text) {
        return <span>-</span>;
    }
    const parts = text.split(/([@#]\w+)/g).filter((part) => part);
    return (
        <div className="flex flex-wrap gap-1">
            {parts.map((part, index) => {
                if (part.startsWith("@")) {
                    return (
                        <span
                            key={index}
                            className="px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                        >
                            {part}
                        </span>
                    );
                }
                if (part.startsWith("#")) {
                    return (
                        <span
                            key={index}
                            className="px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full"
                        >
                            {part}
                        </span>
                    );
                }
                // ในกรณีที่เป็นข้อความธรรมดา อาจจะไม่ต้องแสดงผล หรือแสดงผลแบบปกติ
                // return <span key={index}>{part}</span>;
                return null;
            })}
        </div>
    );
};


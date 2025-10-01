const StatDisplayCard: React.FC<{
    label: string;
    value: number;
    color: string;
    isActive: boolean;
    onClick: () => void;
    description: string;
}> = ({ label, value, color, isActive, onClick, description }) => (
    <div className="relative group flex justify-center">
        <button
            onClick={onClick}
            // TODO: change bg-gray to maybe lighter?
            className={`flex items-center space-x-2 p-3 bg-gray-100 rounded-lg w-full text-left transition-all duration-200 ${isActive ? "ring-2 ring-orange-500 shadow-md" : "hover:bg-gray-200"
                }`}
        >
            <span className={`font-bold text-xl ${color}`}>{value}</span>
            <span className="text-sm text-gray-600">{label}</span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 px-3 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm scale-0 group-hover:scale-100 transition-transform origin-bottom z-10">
            {description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
        </div>
    </div>
);

export default StatDisplayCard;

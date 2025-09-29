import { useFormStatus } from "react-dom";

export const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="mt-1 text-gray-900">{children}</div>
    </div>
);

export const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => {
    const { pending } = useFormStatus();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
};

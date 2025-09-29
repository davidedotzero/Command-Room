import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

// TODO: abstact this sheesh???????????????
type FormButtonProps = {
    type?: "submit" | "reset" | "button";
    className: string;
    children: ReactNode;
    onClick?: () => void;
    disabledText?: string;
}

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


// for wrapping form with useFormStatus() hook
export const FormFieldSetWrapper: React.FC<{ children: ReactNode }> = (({ children }) => {
    const { pending } = useFormStatus();
    return (
        <fieldset disabled={pending}>{children}</fieldset>
    );
});


export const FormButton: React.FC<FormButtonProps> = (({ type, className, children, onClick, disabledText }) => {
    const { pending } = useFormStatus();
    return (
        <button
            type={type}
            disabled={pending}
            className={className}
            onClick={onClick}
        >
            {pending ? disabledText ? disabledText : children : children}
            {/* // LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO */}
        </button>
    );
});

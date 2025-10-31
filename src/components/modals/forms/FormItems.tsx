import { useState, type ChangeEvent, type ReactNode, type Ref } from "react";
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
            <label className="mt-3 block text-sm font-medium text-gray-700 mb-1">
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

export function CharCountInput(
    {
        maxLength,
        valueState,
        onChangeCallback,
        inputClassName,
        placeholder,
        disabled,
        required,
        inputRef
    }: {
        maxLength: number,
        valueState: string,
        onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void,
        inputClassName?: string,
        placeholder?: string,
        disabled?: boolean,
        required?: boolean,
        inputRef?: Ref<HTMLInputElement>
    }
) {
    const [isFocused, setIsFocused] = useState(false);

    const currentLength = valueState.length;
    const isNearLimit = currentLength > maxLength * 0.9;

    const counterColorClass = isNearLimit
        ? 'text-red-500'
        : 'text-gray-400';

    const focusRingClass = isFocused ? "outline-none ring-orange-500 border-orange-500 " : ""

    return (
        <div className="w-full">
            <div className={`flex justify-between items-center w-full ${focusRingClass} ${inputClassName} ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}>
                <input
                    type="text"
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={valueState}
                    onChange={onChangeCallback}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    required={required}
                    className="w-full flex-grow border-none outline-none focus:outline-none focus:ring-0 p-0 bg-transparent"
                    ref={inputRef}
                />

                <div
                    className={`flex-shrink-0 pl-3 text-sm ${counterColorClass}`}
                >
                    {currentLength}/{maxLength}
                </div>
            </div>
        </div>
    );
}

// export function CharCountTextArea(
//     {
//         maxLength,
//         valueState,
//         onChangeCallback,
//         inputClassName,
//         placeholder,
//         disabled,
//         required
//     }: {
//         maxLength: number,
//         valueState: string,
//         onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void,
//         inputClassName?: string,
//         placeholder?: string
//         disabled?: boolean
//         required?: boolean
//     }
// ) {
//     const [isFocused, setIsFocused] = useState(false);
//
//     const currentLength = valueState.length;
//     const isNearLimit = currentLength > maxLength * 0.9;
//
//     const counterColorClass = isNearLimit
//         ? 'text-red-500'
//         : 'text-gray-400';
//
//     const focusRingClass = isFocused ? "outline-none ring-orange-500 border-orange-500 " : ""
//
//     return (
//         <div className="w-full">
//             <div className={`relative w-full ${focusRingClass} ${inputClassName} ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}>
//                 <input
//                     type="text"
//                     maxLength={maxLength}
//                     placeholder={placeholder}
//                     value={valueState}
//                     onChange={onChangeCallback}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     disabled={disabled}
//                     required={required}
//                     className="w-full flex-grow border-none outline-none focus:outline-none focus:ring-0 p-0 bg-transparent"
//                 />
//
//                 <div
//                     className={`flex-shrink-0 pl-3 text-sm ${counterColorClass}`}
//                 >
//                     {currentLength}/{maxLength}
//                 </div>
//             </div>
//         </div>
//     );
// }

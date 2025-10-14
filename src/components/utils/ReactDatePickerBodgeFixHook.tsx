import { useEffect } from "react";

// DATEPICKER W-FULL SUPER SCUFFED FIX LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
export function useEffectDatePickerFix() {
    useEffect(() => {
        const vals = document.getElementsByClassName("react-datepicker__input-container");
        for (const val of vals) {
            val.classList.add("w-full");
        }

        const juan = document.getElementsByClassName("react-datepicker-wrapper");
        for (const val of juan) {
            val.classList.add("w-full");
        }
    }, []);
}

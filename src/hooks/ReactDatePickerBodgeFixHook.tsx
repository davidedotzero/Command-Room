// DATEPICKER W-FULL SUPER SCUFFED FIX LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
import { useEffect } from "react";

export function useEffectDatePickerFix(dependencies?: any) {
    useEffect(() => {
        const vals = document.getElementsByClassName("react-datepicker__input-container");
        for (const val of vals) {
            val.classList.add("w-full");
        }

        const juan = document.getElementsByClassName("react-datepicker-wrapper");
        for (const val of juan) {
            val.classList.add("w-full");
        }
    }, dependencies ? [...dependencies] : []);
}

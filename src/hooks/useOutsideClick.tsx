// hook to see when Ref's outside has been clicked

import { useEffect, type RefObject } from "react";

export function useOutsideClick(ref: RefObject<HTMLElement | null>, callback: () => void, ignoreRef?: RefObject<HTMLElement | null>) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            console.log("1");
            const target = e.target as Node;
            if (ignoreRef && ignoreRef.current && ignoreRef.current.contains(target)) {
                return;
            }

            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        }
        document.addEventListener('mousedown', handleClick);

        return () => {
            console.log("shit removed")
            document.removeEventListener('mousedown', handleClick);
        }
    }, [ref, callback, ignoreRef])
}

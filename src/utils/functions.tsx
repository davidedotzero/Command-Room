export function formatDateYYYY_MM_DD(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(2, "0")}`
    // getMonth() + 1 because it starts counting at 0 (January = 0) FOR SOME REASON GOD KNOWS WHY WHY CANT WE JUST NUKE THIS STUPID SHITTY ASS LANGUAGE FROM HUMANITY ALREADY
}

export function formatDateYYYY_MM_DD_Dashes(date: Date): string {
    return `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

export function formatDateYYYY_MM_DD_HH_MM_SS(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
}

export function calculateLeadTime(deadline: Date, requestDate: Date) {
    const diffTime = +(getOnlyDate(deadline)) - +(getOnlyDate(requestDate)) // just in case JS Date decided to be stupid like it always do
    const diffDays = Math.ceil(msToDay(diffTime));

    // console.log(deadline);
    // console.log(requestDate);
    return diffDays;
}

export function truncateText(text: string, output_length: number = 15) {
    if (!text) {
        return '';
    }

    if (text.length <= output_length) {
        return text;
    }

    return text.slice(0, output_length) + '...';
}

export function isOnlyDateEqual(date1: Date, date2: Date) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export function getOnlyDate(date: Date) {
    return new Date(date.setHours(0, 0, 0, 0));
}

export function msToDay(ms: number): number {
    return ms / (1000 * 60 * 60 * 24);
}

// WARNING: for testing purpose only
export async function testDelay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

// low iq solution for handling returned date ISOString value from database
// since in DB is UTC+7 but Vercel is UTC the date in db gets interpreted as UTC then get sent to us
// effectively making our received datetime +7hrs so we just remove the 'Z' char from the ISOString telling js to convert the date as is
//
// also our dev server is on UTC xd
export function removeLastZchar(date: string): string | null {
    if (!date) {
        return null;
    }

    if (date.endsWith('Z')) {
        return date.slice(0, -1);
    }

    return date;
}


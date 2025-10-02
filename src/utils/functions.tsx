export function formatDateYYYY_MM_DD(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(2, "0")}`
    // getMonth() + 1 because it starts counting at 0 (January = 0) FOR SOME REASON GOD KNOWS WHY WHY CANT WE JUST NUKE THIS STUPID SHITTY ASS LANGUAGE FROM HUMANITY ALREADY
}

export function calculateLeadTime(deadline: Date, requestDate: Date) {
    const diffTime = deadline.getTime() - requestDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

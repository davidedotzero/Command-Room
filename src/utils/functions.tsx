export function formatDateYYYY_MM_DD(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(2, "0")}`
    // getMonth() + 1 because it starts counting at 0 (January = 0) FOR SOME REASON GOD KNOWS WHY WHY CANT WE JUST NUKE THIS STUPID SHITTY ASS LANGUAGE FROM HUMANITY ALREADY
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


export function parseYYYYMMDD(dateString: string) {
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10);
    const day = parseInt(dateString.substring(6, 8), 10);

    // this will return Date with no time
    return new Date(year, month - 1, day);
}

export function msToDay(ms: number): number {
    return ms / (1000 * 60 * 60 * 24);
}

// TODO: validateTaskID and validateUserID cuz they are not the same
export function validateID(id: string): boolean {
    const idRegex: RegExp = /^[^-]+-\d{8}-\d{6}$/;
    if (!idRegex.test(id)) {
        return false;
    }

    return true;
}

export function genSingleNewID(latestID: string): string {
    if (!validateID(latestID)) {
        throw new Error(`Given ID ${latestID} does not match the format PREFIX-YYYYMMDD-XXXXX.`);
    }

    const split = latestID.split("-");
    const [prefix, strDate, strNum] = split;

    const idNum = Number(strNum);
    const idDate = parseYYYYMMDD(strDate);
    let newNum: number | null = null;
    let newDate: string | null = null;

    // parseYYYYMMDD will return Date() with no time so we can compare it directly like this
    if (idDate === getOnlyDate(new Date())) {
        newNum = idNum + 1;
        newDate = strDate;
    }
    else {
        newNum = 1; // reset id for new date
        const a = new Date();
        newDate = "" + a.getFullYear() + String(a.getMonth() + 1).padStart(2, "0") + String(a.getDate()).padStart(2, "0")
    }

    return `${prefix}-${newDate}-${String(newNum).padStart(6, "0")}`;
}

export function genMultipleNewID(latestID: string, count: number): string[] {
    throw new Error("Not implemented.");
    return [""];
}

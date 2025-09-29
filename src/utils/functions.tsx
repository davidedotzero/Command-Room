export function formatDateYYYY_MM_DD(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    // getMonth() + 1 because it starts counting at 0 (January = 0) FOR SOME REASON GOD KNOWS WHY WHY CANT WE JUST NUKE THIS STUPID SHITTY ASS LANGUAGE FROM HUMANITY ALREADY
}

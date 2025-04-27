/**
 *  Used with the dashboard requests to fetch data from the server
 * @param {{year, month}} dateObj 
 * @returns  a formatted date string in the format "YYYY-MM-01".
 *
 */
export function formatDateTo_YYYY_MM_01(dateObj) {
    let month = dateObj.month < 10 ? `0${dateObj.month}` : dateObj.month;
    let year = dateObj.year;
    return `${year}-${month}-${"01"}`;
}

export function randomDataMaker(randomArray) {
    function randomNumber() {
        return Math.floor(Math.random() * 10) + 5;
    }
    return randomArray.map((obj) => {
        obj.desktop = randomNumber();
        obj.mobile = randomNumber();
        return obj;
    });
}
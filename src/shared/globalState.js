const {atom} = require('recoil');
const date = new Date();

export const chartsToPrintState = atom({
    key : 'chartsToPrint', 
    default : []
});

export const tablesToPrintState = atom({
    key : 'tablesToPrint', 
    default : []
});

export const dateStartEndState = atom({
    key: 'dateStartEnd',
    default : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
});

export const weeklyDataState = atom({
    key : 'weeklyData',
    default : {}
});
export const dailyDataState = atom({
    key : 'dailyData',
    default : {}
});

export const loaderIsHidden = atom({
    key : "loaderIsHidden",
    default : true
});

export const files = atom({
    key : 'files',
    default : {}
});
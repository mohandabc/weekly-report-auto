const {atom} = require('recoil');

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
    default : '1/1/2022 - 1/1/2022'
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
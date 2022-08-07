const {atom} = require('recoil');

export const chartsToPrintState = atom({
    key : 'chartsToPrint', 
    default : []
});

export const dateStartEndState = atom({
    key: 'dateStartEnd',
    default : '1/1/2022 - 1/1/2022'
});
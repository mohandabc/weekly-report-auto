const {atom} = require('recoil');

export const chartsToPrintState = atom({
    key : 'chartsToPrint', 
    default : []
});

export const dateStartState = atom({
    key: 'dateStart',
    default : ''
});
export const dateEndState = atom({
    key: 'dateEnd',
    default : ''
});
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';


export const DEFAULT_CONFIG_BAR_OPTIONS = {
  well: false,
  rig: false,
  pole: false,
  phase: false,
  datePicker: true,
  files: false,
  option : 'Reporting'
};
export const DELIVERABLE_CONFIG_BAR_OPTIONS = {
  well: true,
  rig: true,
  pole: true,
  phase: true,
  datePicker: true,
  files: true,
  option : 'Deliverable'
};

export const predefinedRanges = [
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left'
  },
  {
    label: 'Last 7 days',
    value: [subDays(new Date(), 6), new Date()],
    placement: 'left'
  },
  {
    label: 'Last 30 days',
    value: [subDays(new Date(), 29), new Date()],
    placement: 'left'
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left'
  },
  {
    label: 'Last month',
    value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    placement: 'left'
  },
  {
    label: 'This year',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last year',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
    placement: 'left'
  },
  {
    label: 'All time',
    value: [new Date(new Date().getFullYear() - 10, 0, 1), new Date()],
    placement: 'left'
  },
];

// End Of well Report constants
export const runCasingMap = {
  '36"': 'run_casing36',
  '26"': 'run_casing26',
  '17"1/2': 'run_casing17',
  '16"': 'run_casing16',
  '12"1/4': 'run_casing12',
  '8"1/2': 'run_casing8',
  '6"': 'run_casing6',
  '3"2/4': 'run_casing3',
};
export const rbrIMap = {
  '36"': 'ream_back_ream_interval36',
  '26"': 'ream_back_ream_interval26',
  '16"': 'ream_back_ream_interval16',
  '12"1/4': 'ream_back_ream_interval12',
  '8"1/2': 'ream_back_ream_interval8',
  '6"': 'ream_back_ream_interval6',
  '6"': 'ream_back_ream_interval6',
};
export const holeSectionMap = {
'36"': {
  imageKeys: ['ream_back_ream_36_1', 'ream_back_ream_36_2', 'ream_back_ream_36_3', 'ream_back_ream_36_4'],
  count: 4,
},
'26"': {
  imageKeys: ['ream_back_ream_26_1', 'ream_back_ream_26_2', 'ream_back_ream_26_3', 'ream_back_ream_26_4'],
  count: 4,
},
'16"': {
  imageKeys: ['ream_back_ream_16_1', 'ream_back_ream_16_2', 'ream_back_ream_16_3', 'ream_back_ream_16_4'],
  count: 4,
},
'12"': {
  imageKeys: ['ream_back_ream_12_1', 'ream_back_ream_12_2', 'ream_back_ream_12_3', 'ream_back_ream_12_4'],
  count: 4,
},
'8"1/2': {
  imageKeys: ['ream_back_ream_8_1', 'ream_back_ream_8_2', 'ream_back_ream_8_3', 'ream_back_ream_8_4'],
  count: 4,
},
'6"': {
  imageKeys: ['ream_back_ream_6_1', 'ream_back_ream_6_2', 'ream_back_ream_6_3', 'ream_back_ream_6_4'],
  count: 4,
},
'Completion': {
  imageKeys: ['ream_back_ream_completion_1', 'ream_back_ream_completion_2', 'ream_back_ream_completion_3', 'ream_back_ream_completion_4'],
  count: 4,
},
};
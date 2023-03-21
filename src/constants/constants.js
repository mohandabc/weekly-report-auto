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
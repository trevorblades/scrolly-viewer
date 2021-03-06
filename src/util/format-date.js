import moment from 'moment';

export default date =>
  moment()
    .calendar(new Date(date), {
      lastDay: '[yesterday at] LT',
      sameDay: '[today at] LT',
      nextDay: '[tomorrow at] LT',
      lastWeek: '[last] dddd [at] LT',
      sameElse: '[on] MMMM D, YYYY'
    })
    .toLowerCase();

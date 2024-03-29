const dateFieldFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const formattedDateField = (dt) =>
  dt && dt instanceof Date ? dateFieldFormatter.format(dt) : '';

const monthYearFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'long',
});

const formattedMonthYear = (dt) =>
  dt && dt instanceof Date ? monthYearFormatter.format(dt) : '';

const firstDayOfMonth = (d) => new Date(d.yr, d.mo).getDay();

const lastDateInMonth = (d) => new Date(d.yr, d.mo + 1, 0).getDate();

const extractDateParts = (d) => ({
  yr: d.getFullYear(),
  mo: d.getMonth(),
  dt: d.getDate(),
});

const afterToday = (cur, d) => {
  const today = new Date();
  return (
    cur.yr === today.getFullYear() &&
    cur.mo === today.getMonth() &&
    d > today.getDate()
  );
};

const isSelectableDate = (cur, d, validFrom) => {
  let isValid = true;
  if (validFrom && validFrom instanceof Date) {
    const validDate = new Date(
      validFrom.getFullYear(),
      validFrom.getMonth(),
      validFrom.getDate()
    );
    const curDt = new Date(cur.yr, cur.mo, d);
    isValid = curDt >= validDate;
  }
  return isValid && !afterToday(cur, d);
};

const selectedDate = (index, cur, dt) => {
  if (!dt || !(dt instanceof Date)) return false;
  return (
    dt.getFullYear() === cur.yr &&
    dt.getMonth() === cur.mo &&
    dt.getDate() === index + 1
  );
};

const daysOfWeek = () => {
  const now = Date.now();
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const startDayInMs = now - new Date().getDay() * millisecondsInDay;
  const formats = ['long', 'short'];
  const formatters = formats.map(
    (fmt) => new Intl.DateTimeFormat('default', { weekday: fmt })
  );

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startDayInMs + i * millisecondsInDay);
    return formats.reduce(
      (acc, fmt, idx) => ({ ...acc, [fmt]: formatters[idx].format(d) }),
      {}
    );
  });
};

export {
  formattedDateField,
  formattedMonthYear,
  firstDayOfMonth,
  lastDateInMonth,
  extractDateParts,
  selectedDate,
  daysOfWeek,
  isSelectableDate,
};

const getHourMinuteFromTimeString = (timeString) => {
  const parts = timeString.split(/:| /);
  return parts.length === 3
    ? {
        hr: (Number(parts[0]) % 12) + (parts[2] === 'pm' ? 12 : 0),
        mi: Number(parts[1]),
      }
    : {};
};

const isValidTime = (timeString, validFrom, validTill, date) => {
  const { hr, mi } = getHourMinuteFromTimeString(timeString);
  if (!isHourMinuteNumbers(hr, mi)) return false;
  if (!(date instanceof Date)) return true;
  let isValid = true;
  const d = normalizedDateTime(date, hr, mi);
  if (validFrom instanceof Date) isValid = d >= normalizedDateTime(validFrom);
  if (validTill instanceof Date)
    isValid = isValid && d <= normalizedDateTime(validTill);
  return isValid;
};

const normalizedDateTime = (dt = new Date(), hr, mi) =>
  new Date(
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate(),
    typeof hr === 'number' ? hr : dt.getHours(),
    typeof mi === 'number' ? mi : dt.getMinutes()
  );

const isHourMinuteNumbers = (hr, mi) =>
  typeof hr === 'number' && typeof mi === 'number';

export {
  getHourMinuteFromTimeString,
  isValidTime,
  normalizedDateTime,
  isHourMinuteNumbers,
};

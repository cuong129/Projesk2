function FormatPeriodTime(startTime) {
  let dateString = '';
  let periodTime = (Date.now() - startTime) / 1000; //get seconds

  if (periodTime > 86400) {
    let date = new Date(periodTime * 1000);
    dateString =
      date.getUTCDate() +
      '/' +
      (date.getUTCMonth() + 1) +
      '/' +
      date.getUTCFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getUTCMinutes();
  } else if (periodTime >= 3600) {
    dateString = Math.floor(periodTime / 3600) + ' hours ago';
  } else if (periodTime >= 60) {
    dateString = Math.floor(periodTime / 60) + ' minustes ago';
  } else dateString = 'just now';
  return dateString;
}

export default FormatPeriodTime;

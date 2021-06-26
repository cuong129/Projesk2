function FormatPeriodTime(startTime) {
  let dateString = '';
  let periodTime = (Date.now() - startTime) / 1000; //get seconds

  if (periodTime > 86400) {
    let date = new Date(startTime);
    dateString =
      date.getUTCDate() +
      '/' +
      (date.getUTCMonth() + 1) +
      '/' +
      date.getUTCFullYear() +
      ' ' +
      date.getHours() +
      ':';
      if (date.getUTCMinutes() < 9) {
        dateString += '0' + date.getUTCMinutes();
      } else {
        dateString += date.getUTCMinutes();
      }
  } else if (periodTime >= 3600) {
    var hour = Math.floor(periodTime / 3600);
    dateString = hour === 1 
    ? hour + ' hour ago'
    : hour + ' hours ago';
  } else if (periodTime >= 60) {
    var min = Math.floor(periodTime / 60);
    dateString = min === 1 
    ? min + ' minute ago'
    : min + ' minutes ago';
  } else dateString = 'just now';
  return dateString;
}

export default FormatPeriodTime;

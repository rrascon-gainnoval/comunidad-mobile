export const convertUTCDateToLocalDate = (date) => {
  let newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return newDate;
};

export const convertDateToUTCDate = (date) => {
  let now = new Date();
  let now_utc = new Date(now.toUTCString().slice(0, -4));
  return now_utc;
};

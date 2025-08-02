export const getCurrrentDate = (
  dateToFormat = new Date(),
  format = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
) => {
  const date = Intl.DateTimeFormat("id-ID", format);
  return date.format(dateToFormat);
};

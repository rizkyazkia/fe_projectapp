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

export const capitalizeText = (text) => {
  const splitedText = text.split(" ");

  for (let x = 0; x < splitedText.length; x++) {
    splitedText[x] =
      splitedText[x][0].toUpperCase() + splitedText[x].substring(1);
  }

  return splitedText.join(" ");
};

export const generateSchoolYears = (count = 6) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const year = currentYear - i;
    const value = `${year}/${year + 1}`;
    return { value, label: value };
  })
}

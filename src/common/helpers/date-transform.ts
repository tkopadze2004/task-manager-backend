export const monthDiff = (startDate: Date, endDate: Date) => {
  let months;
  months =
    (new Date(endDate).getFullYear() - new Date(startDate).getFullYear()) * 12;
  months -= new Date(startDate).getMonth();
  months += new Date(endDate).getMonth();
  return months <= 0 ? 0 : months;
};

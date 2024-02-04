export const numberFormatter = (number?: number) => {
  if (!number) {
    return "NaN";
  }

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
};

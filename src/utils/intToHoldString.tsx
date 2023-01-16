export const intToHoldString = (int: number) => {
  const str = int.toString(2).padStart(5, "0");
  return str;
};

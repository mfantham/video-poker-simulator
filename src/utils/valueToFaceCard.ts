export const valueToFaceCard = (value: number, tenIsT = false): string => {
  switch (value) {
    case 10:
      return tenIsT ? "T" : "10";
    case 1:
      return "A";
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    default:
      return `${value}`;
  }
};

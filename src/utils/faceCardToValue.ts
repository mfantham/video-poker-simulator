export const faceCardToValue = (faceCard: string): number => {
  switch (faceCard.toUpperCase()) {
    case "T":
      return 10;
    case "A":
      return 1;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    default:
      return Number(faceCard);
  }
};

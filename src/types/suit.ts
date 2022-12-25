export enum Suit {
  CLUB = 0,
  DIAMOND = 1,
  HEART = 2,
  SPADE = 3,
}

export const letterToSuit = (letter: string): Suit => {
  switch (letter.toUpperCase()) {
    case "C":
      return Suit.CLUB;
    case "D":
      return Suit.DIAMOND;
    case "H":
      return Suit.HEART;
    case "S":
      return Suit.SPADE;
    default:
      throw new Error("Invalid suit letter");
  }
};

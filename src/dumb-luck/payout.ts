export enum Payout {
  ROYAL_FLUSH = 800,
  STRAIGHT_FLUSH = 50,
  FOUR_OF_A_KIND = 25,
  FULL_HOUSE = 9,
  FLUSH = 6,
  STRAIGHT = 5,
  THREE_OF_A_KIND = 3,
  TWO_PAIR = 3,
  JACKS_OR_BETTER = 2,
  PAIR = 1, // Hmm this isn't really an enum then, more a lookup table
  DEFAULT = 0,
}

export const costOfGame = 0.81;

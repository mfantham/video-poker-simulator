export enum WIN_ENCODED {
  ROYAL_FLUSH = 9,
  STRAIGHT_FLUSH = 8,
  FOUR_OF_A_KIND = 7,
  FULL_HOUSE = 6,
  FLUSH = 5,
  STRAIGHT = 4,
  THREE_OF_A_KIND = 3,
  TWO_PAIR = 2,
  JACKS_OR_BETTER = 1,
  DEFAULT = 0,
}

export const WinNames = {
  [WIN_ENCODED.ROYAL_FLUSH]: "Royal flush",
  [WIN_ENCODED.STRAIGHT_FLUSH]: "Straight flush",
  [WIN_ENCODED.FOUR_OF_A_KIND]: "Four of a kind",
  [WIN_ENCODED.FULL_HOUSE]: "Full house",
  [WIN_ENCODED.FLUSH]: "Flush",
  [WIN_ENCODED.STRAIGHT]: "Straight",
  [WIN_ENCODED.THREE_OF_A_KIND]: "Three of a kind",
  [WIN_ENCODED.TWO_PAIR]: "Two pair",
  [WIN_ENCODED.JACKS_OR_BETTER]: "Jacks or better",
  [WIN_ENCODED.DEFAULT]: "Junk",
};

export const Payout = {
  [WIN_ENCODED.ROYAL_FLUSH]: 800,
  [WIN_ENCODED.STRAIGHT_FLUSH]: 50,
  [WIN_ENCODED.FOUR_OF_A_KIND]: 25,
  [WIN_ENCODED.FULL_HOUSE]: 9,
  [WIN_ENCODED.FLUSH]: 6,
  [WIN_ENCODED.STRAIGHT]: 4,
  [WIN_ENCODED.THREE_OF_A_KIND]: 3,
  [WIN_ENCODED.TWO_PAIR]: 2,
  [WIN_ENCODED.JACKS_OR_BETTER]: 1,
  [WIN_ENCODED.DEFAULT]: 0,
};

export type PayoutIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

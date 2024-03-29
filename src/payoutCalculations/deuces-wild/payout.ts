export enum WIN_ENCODING {
  NATURAL_ROYAL_FLUSH = 10,
  FOUR_DEUCES = 9,
  ROYAL_FLUSH = 8,
  FIVE_OF_A_KIND = 7,
  STRAIGHT_FLUSH = 6,
  FOUR_OF_A_KIND = 5,
  FULL_HOUSE = 4,
  FLUSH = 3,
  STRAIGHT = 2,
  THREE_OF_A_KIND = 1,
  DEFAULT = 0,
}

export const WinNames = {
  [WIN_ENCODING.NATURAL_ROYAL_FLUSH]: "Natural Royal Flush",
  [WIN_ENCODING.FOUR_DEUCES]: "Four Deuces",
  [WIN_ENCODING.ROYAL_FLUSH]: "Wild royal Flush",
  [WIN_ENCODING.FIVE_OF_A_KIND]: "Five of a Kind",
  [WIN_ENCODING.STRAIGHT_FLUSH]: "Straight Flush",
  [WIN_ENCODING.FOUR_OF_A_KIND]: "Four of a Kind",
  [WIN_ENCODING.FULL_HOUSE]: "Full House",
  [WIN_ENCODING.FLUSH]: "Flush",
  [WIN_ENCODING.STRAIGHT]: "Straight",
  [WIN_ENCODING.THREE_OF_A_KIND]: "Three of a Kind",
  [WIN_ENCODING.DEFAULT]: "Junk",
};

export const Payout = {
  [WIN_ENCODING.NATURAL_ROYAL_FLUSH]: 800,
  [WIN_ENCODING.FOUR_DEUCES]: 200,
  [WIN_ENCODING.ROYAL_FLUSH]: 25,
  [WIN_ENCODING.FIVE_OF_A_KIND]: 15,
  [WIN_ENCODING.STRAIGHT_FLUSH]: 9,
  [WIN_ENCODING.FOUR_OF_A_KIND]: 5,
  [WIN_ENCODING.FULL_HOUSE]: 3,
  [WIN_ENCODING.FLUSH]: 2,
  [WIN_ENCODING.STRAIGHT]: 2,
  [WIN_ENCODING.THREE_OF_A_KIND]: 1,
  [WIN_ENCODING.DEFAULT]: 0,
};

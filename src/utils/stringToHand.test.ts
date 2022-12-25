import { stringToHand } from "./stringToHand";
import { Suit } from "../types/suit";

test("Various strings become the correct hands", () => {
  const testString1 = "7DADJCTC6C";
  const testString2 = "5d4d5stskd";

  const testHand1 = [
    { idx: 19, suit: Suit.DIAMOND, value: 7 },
    { idx: 13, suit: Suit.DIAMOND, value: 1 },
    { idx: 10, suit: Suit.CLUB, value: 11 },
    { idx: 9, suit: Suit.CLUB, value: 10 },
    { idx: 5, suit: Suit.CLUB, value: 6 },
  ];

  const testHand2 = [
    { idx: 17, suit: Suit.DIAMOND, value: 5 },
    { idx: 16, suit: Suit.DIAMOND, value: 4 },
    { idx: 43, suit: Suit.SPADE, value: 5 },
    { idx: 48, suit: Suit.SPADE, value: 10 },
    { idx: 25, suit: Suit.DIAMOND, value: 13 },
  ];

  expect(stringToHand(testString1)).toEqual(testHand1);
  expect(stringToHand(testString2)).toEqual(testHand2);
});

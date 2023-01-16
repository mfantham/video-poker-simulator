import { Stages } from "../redux/types";
import React, { useCallback } from "react";
import {
  useCurrentHand,
  useDeck,
  useDecrement,
  useHolds,
  useIncrement,
  useResetHolds,
  useSetCurrentHand,
  useSetDeck,
  useSetStage,
  useSetWin,
  useStage,
} from "../redux/hooks";
import { deal } from "../mechanics/deal";
import { Hand } from "../types/hand";
import { calculateWins } from "../payoutCalculations/deuces-wild/calculatePayout";
import { Payout } from "../payoutCalculations/deuces-wild/payout";

export const DealButton = () => {
  const gameStage = useStage();
  const setStage = useSetStage();
  const setCurrentHand = useSetCurrentHand();
  const currentHand = useCurrentHand();
  const setCurrentDeck = useSetDeck();
  const currentDeck = useDeck();
  const resetHolds = useResetHolds();
  const incrementCoins = useIncrement();
  const decrementCoins = useDecrement();
  const holds = useHolds();
  const setWin = useSetWin();

  const handleDeal = useCallback(() => {
    const [newDeal, deck] = deal();
    setCurrentDeck(deck);
    setCurrentHand(newDeal);
    decrementCoins(1); // TODO: add bet size
    const winId = calculateWins(newDeal);
    setWin(winId); // At this stage, we don't pay out.
    setStage(Stages.DEALT);
  }, [decrementCoins, setCurrentDeck, setCurrentHand, setStage, setWin]);

  const handleDraw = useCallback(() => {
    // Replace hand with n-new-cards
    let newHand = [...currentHand] as Hand;
    for (let i = 0; i < holds.length; i++) {
      if (!holds[i]) {
        // TODO: Better replacement strategy
        // This is random enough for 1 hand though :)
        newHand[i] = currentDeck[i + 5];
      }
    }
    setCurrentHand(newHand);

    resetHolds();
    const winId = calculateWins(newHand);
    setWin(winId);
    incrementCoins(Payout[winId]); // TODO: scale by bet size
    setStage(Stages.PAYING);
  }, [
    currentDeck,
    currentHand,
    holds,
    incrementCoins,
    resetHolds,
    setCurrentHand,
    setStage,
    setWin,
  ]);

  if (gameStage !== Stages.DEALT) {
    return <button onClick={handleDeal}>Deal</button>;
  } else {
    return <button onClick={handleDraw}>Draw</button>;
  }
};

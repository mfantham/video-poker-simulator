import { Stages } from "../../redux/types";
import React, { useCallback } from "react";
import {
  useBetSize,
  useCoinsPerBet,
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
  useVariant,
} from "../../redux/hooks";
import { deal } from "../../mechanics/deal";
import { Hand } from "../../types/hand";
import { calculateWins, payout } from "../../payoutCalculations";

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
  const variant = useVariant();
  const betSize = useBetSize();
  const coinsPerBet = useCoinsPerBet();

  const handleDeal = useCallback(() => {
    const [newDeal, deck] = deal();
    setCurrentDeck(deck);
    setCurrentHand(newDeal);
    decrementCoins(betSize * coinsPerBet);
    const winId = calculateWins(newDeal, variant);
    setWin(winId); // At this stage, we don't pay out. Any win-on-the-deal is for player info only
    setStage(Stages.DEALT);
  }, [
    betSize,
    coinsPerBet,
    decrementCoins,
    setCurrentDeck,
    setCurrentHand,
    setStage,
    setWin,
    variant,
  ]);

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
    const winId = calculateWins(newHand, variant);
    setWin(winId);
    const winPayout = payout(winId, variant) * betSize * coinsPerBet;
    incrementCoins(winPayout);
    setStage(Stages.PAYING);
  }, [
    betSize,
    coinsPerBet,
    currentDeck,
    currentHand,
    holds,
    incrementCoins,
    resetHolds,
    setCurrentHand,
    setStage,
    setWin,
    variant,
  ]);

  if (gameStage !== Stages.DEALT) {
    return <button onClick={handleDeal}>Deal</button>;
  } else {
    return <button onClick={handleDraw}>Draw</button>;
  }
};

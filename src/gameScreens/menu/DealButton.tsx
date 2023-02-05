import { useCallback } from "react";
import { Stages } from "../../redux/types";
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
import { MenuButton } from "./MenuButton";

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
    resetHolds();
    const [newDeal, deck] = deal();
    setCurrentDeck(deck);
    setCurrentHand(newDeal);
    decrementCoins(betSize * coinsPerBet);
    const winId = calculateWins(newDeal, variant);
    setWin(winId); // At this stage, we don't pay out. Any win-on-the-deal is for player info only
    setStage(Stages.DEALING);
  }, [
    betSize,
    coinsPerBet,
    decrementCoins,
    resetHolds,
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

    const winId = calculateWins(newHand, variant);
    setWin(winId);
    const winPayout = payout(winId, variant) * betSize * coinsPerBet;
    incrementCoins(winPayout);
    setStage(Stages.DRAWING);
  }, [
    betSize,
    coinsPerBet,
    currentDeck,
    currentHand,
    holds,
    incrementCoins,
    setCurrentHand,
    setStage,
    setWin,
    variant,
  ]);

  if (gameStage === Stages.DEALT) {
    return (
      <MenuButton onClick={handleDraw} keyCode={["Space", "Enter", "KeyD"]}>
        draw
      </MenuButton>
    );
  }
  if (gameStage === Stages.PREGAME || gameStage === Stages.PAID) {
    return (
      <MenuButton onClick={handleDeal} keyCode={["Space", "Enter", "KeyD"]}>
        deal
      </MenuButton>
    );
  } else {
    return (
      <MenuButton disabled onClick={handleDeal}>
        deal
      </MenuButton>
    );
  }
};

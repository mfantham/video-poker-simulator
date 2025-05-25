import { useCallback } from "react";
import { Stages } from "../../redux/types";
import {
  useBetSize,
  useClearWins,
  useCoinsPerBet,
  useCurrentHand,
  useDealtHand,
  useDecrement,
  useHolds,
  useIncrement,
  useNHands,
  useOptimalHolds,
  useResetHolds,
  useSetCurrentHand,
  useSetCurrentHands,
  useSetDealtHand,
  useSetDeck,
  useSetShowWarning,
  useSetStage,
  useSetWin,
  useStage,
  useVariant,
  useWarnMistakes,
} from "../../redux/hooks";
import { deal, newDeck, shuffle } from "../../mechanics/deal";
import { Hand } from "../../types/hand";
import { calculateWins, payout } from "../../payoutCalculations";
import { MenuButton } from "./MenuButton";
import { N_HANDS } from "../../types/variant";

export const DealButton = ({ forceDraw = false }) => {
  const gameStage = useStage();
  const setStage = useSetStage();
  const setCurrentHand = useSetCurrentHand();
  const currentHand = useCurrentHand();
  const setCurrentDeck = useSetDeck();
  const setDealtHand = useSetDealtHand();
  const resetHolds = useResetHolds();
  const incrementCoins = useIncrement();
  const decrementCoins = useDecrement();
  const holds = useHolds();
  const warnMistakes = useWarnMistakes();
  const setShowWarning = useSetShowWarning();
  const optimalHolds = useOptimalHolds();
  const setWin = useSetWin();
  const clearWins = useClearWins();
  const variant = useVariant();
  const betSize = useBetSize();
  const coinsPerBet = useCoinsPerBet();
  const nHands = useNHands();
  const dealtHand = useDealtHand();
  const setCurrentHands = useSetCurrentHands();

  const handleDeal = useCallback(() => {
    resetHolds();
    clearWins();
    const [newDeal, deck] = deal();
    setCurrentDeck(deck);
    setDealtHand(newDeal);
    setCurrentHand(newDeal);
    decrementCoins(betSize * coinsPerBet * nHands);
    const winId = calculateWins(newDeal, variant);
    if (nHands === N_HANDS.ONE) {
      setWin(winId); // At this stage, we don't pay out. Any win-on-the-deal is for player info only
    }
    setStage(Stages.DEALING);
  }, [
    betSize,
    clearWins,
    coinsPerBet,
    decrementCoins,
    nHands,
    resetHolds,
    setCurrentDeck,
    setCurrentHand,
    setDealtHand,
    setStage,
    setWin,
    variant,
  ]);

  const handleDraw = useCallback(() => {
    const currentIdxes = currentHand.map(({ idx }) => idx);

    if (warnMistakes && optimalHolds && !forceDraw) {
      const sortOrder = dealtHand.handSortOrder;
      const sortedOptimalHolds = optimalHolds.map((optimalHold) =>
        optimalHold
          .split("")
          .map((v, idx) => optimalHold.split("")[sortOrder[idx]])
      );

      const noMistakes = sortedOptimalHolds.some((optimalHold) =>
        optimalHold.every((hold, idx) => Number(hold) === Number(holds[idx]))
      );
      if (!noMistakes) {
        setShowWarning(true);
        return;
      }
    }

    setShowWarning(false);
    const newHands = [];

    for (let h = 0; h < nHands; h++) {
      // for each hand:
      const replacementOptions = shuffle(
        newDeck().filter(({ idx }) => !currentIdxes.includes(idx))
      );

      let newHand = [...dealtHand.hand] as Hand;
      for (let i = 0; i < holds.length; i++) {
        if (!holds[i]) {
          newHand[i] = replacementOptions[i];
        }
      }
      newHands.push(newHand);
    }
    setCurrentHands(newHands);

    let totalWin = 0;

    if (nHands > N_HANDS.ONE) {
      for (let h = 0; h < nHands; h++) {
        const winId = calculateWins(newHands[h], variant);
        totalWin += payout(winId, variant) * betSize * coinsPerBet;
      }
    } else {
      const winId = calculateWins(newHands[0], variant);
      setWin(winId);
      totalWin = payout(winId, variant) * betSize * coinsPerBet;
    }
    incrementCoins(totalWin);
    setStage(Stages.DRAWING);
  }, [
    betSize,
    coinsPerBet,
    currentHand,
    dealtHand.hand,
    dealtHand.handSortOrder,
    forceDraw,
    holds,
    incrementCoins,
    nHands,
    optimalHolds,
    setCurrentHands,
    setShowWarning,
    setStage,
    setWin,
    variant,
    warnMistakes,
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

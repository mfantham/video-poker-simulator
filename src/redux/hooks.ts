import { useCallback } from "react";
import { HoldsTable } from "../types/Hold";

import { N_HANDS, VARIANT } from "../types/variant";
import { Hand } from "../types/hand";
import { Deck } from "../types/deck";
import { sleep } from "../utils/sleep";
import { deal } from "../mechanics/deal";
import { Stages } from "./types";

import { useAppSelector, useAppDispatch } from "./store";
import {
  incrementCoinsPerBet,
  incrementSpeed,
  incrementVolume,
  toggleWarnMistakes,
  toggleOverlayOptimalPlay,
  toggleWebGPUAnalysis,
} from "./settingsSlice";
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  addStatsHistory,
} from "./statsSlice";
import {
  setCurrentHandByIdx,
  setCurrentHand,
  setCurrentHands,
  setDealtHand,
  setCurrentDeck,
  setVariant,
  setNHands,
  setStage,
  resetHolds,
  toggleHold,
  setWin,
  setWins,
  clearWins,
  setPayout,
  incrementBet,
  setMaxBet,
  toggleShowAnalysis,
  setShowWarning,
  setCurrentAnalysis,
} from "./gameSlice";

export const useStage = () => useAppSelector((state) => state.game.stage);
export const useSetStage = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    (newStage: Stages) => dispatch(setStage(newStage)),
    [dispatch]
  );
};

export const useCurrentHand = () =>
  useAppSelector((state) => state.game.currentHands[0].hand);

export const useCurrentHands = () =>
  useAppSelector((state) => state.game.currentHands);

export const useDealtHand = () =>
  useAppSelector((state) => state.game.dealtHandInfo);

export const useFullHand = () =>
  useAppSelector((state) => state.game.currentHands[0]);

export const useCurrentHandIdx = () =>
  useAppSelector((state) => state.game.currentHands[0].handIdx);

export const useVariant = () => useAppSelector((state) => state.game.variant);

export const useNHands = () => useAppSelector((state) => state.game.nHands);

export const useCurrentAnalysis = () => {
  const state = useAppSelector((state) => state.game.analysis);
  return state;
};

export const useSetCurrentHand = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (hand: Hand) => {
      dispatch(setCurrentHand(hand));
    },
    [dispatch]
  );
};

export const useSetCurrentHands = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (hands: Hand[]) => {
      dispatch(setCurrentHands(hands));
    },
    [dispatch]
  );
};

export const useSetDealtHand = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (hand: Hand) => {
      dispatch(setDealtHand(hand));
    },
    [dispatch]
  );
};

export const useSetCurrentHandIdx = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (handIdx: number) => dispatch(setCurrentHandByIdx(handIdx)),
    [dispatch]
  );
};

export const useSetVariant = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (variant: VARIANT) => dispatch(setVariant(variant)),
    [dispatch]
  );
};

export const useSetNHands = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (nHands: N_HANDS) => {
      const [newDeal] = deal();
      const newHands = new Array(nHands).fill(newDeal);
      dispatch(setCurrentHands(newHands));
      dispatch(setNHands(nHands));
    },
    [dispatch]
  );
};

export const useHolds = () => useAppSelector((state) => state.game.holds);
export const useResetHolds = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(resetHolds()), [dispatch]);
};
export const useToggleHold = () => {
  const dispatch = useAppDispatch();

  return useCallback((idx: number) => dispatch(toggleHold(idx)), [dispatch]);
};

export const useDeck = () => useAppSelector((state) => state.game.deck);
export const useSetDeck = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (deck: Deck) => dispatch(setCurrentDeck(deck)),
    [dispatch]
  );
};

export const useCoins = () => useAppSelector((state) => state.stats.coins);
export const useIncrement = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (v: number) => {
      dispatch(setPayout(v ?? 1));

      const steps = v ?? 1;
      for (let i = 0; i < steps; i++) {
        dispatch(incrementByAmount(1));
        await sleep(100);
      }
    },
    [dispatch]
  );
};

export const useDecrement = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (v: number) => dispatch(decrementByAmount(v ?? 1)),
    [dispatch]
  );
};

export const useSetWin = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (winId: number) => dispatch(setWin({ winId, handIdx: 0 })),
    [dispatch]
  );
};

export const useSetWinN = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (winId: number, handIdx: number) => dispatch(setWin({ winId, handIdx })),
    [dispatch]
  );
};

export const useSetWins = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (winIds: number[]) => dispatch(setWins(winIds)),
    [dispatch]
  );
};

export const useClearWins = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(clearWins());
  }, [dispatch]);
};

export const useWin = () =>
  useAppSelector(
    (state) => state.game.wins[0] ?? { winId: 0, winAmount: 0, winName: "" }
  );
export const useWins = () => useAppSelector((state) => state.game.wins);
export const usePay = () => useAppSelector((state) => state.game.pay);

export const useBetSize = () => useAppSelector((state) => state.game.betSize);
export const useCoinsPerBet = () =>
  useAppSelector((state) => state.settings.coinsPerBet);

export const useSetMaxBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(setMaxBet()), [dispatch]);
};
export const useIncrementBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementBet()), [dispatch]);
};
export const useIncrementCoinsPerBet = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementCoinsPerBet()), [dispatch]);
};

export const useToggleShowAnalysis = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(toggleShowAnalysis()), [dispatch]);
};

export const useShowAnalysis = () =>
  useAppSelector((state) => state.game.showAnalysis);

export const useSpeed = () => useAppSelector((state) => state.settings.speed);
export const useIncrementSpeed = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementSpeed()), [dispatch]);
};

export const useSetShowWarning = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (showWarning: boolean) => dispatch(setShowWarning(showWarning)),
    [dispatch]
  );
};

export const useShowWarning = () =>
  useAppSelector((state) => state.game.showWarning);

export const useVolume = () => useAppSelector((state) => state.settings.volume);
export const useIncrementVolume = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(incrementVolume()), [dispatch]);
};

export const useWarnMistakes = () =>
  useAppSelector((state) => state.settings.warnMistakes);
export const useToggleWarnMistakes = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(toggleWarnMistakes()), [dispatch]);
};

export const useOverlayOptimalPlay = () =>
  useAppSelector((state) => state.settings.overlayOptimalPlay);
export const useToggleOverlayOptimalPlay = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(toggleOverlayOptimalPlay()), [dispatch]);
};

export const useWebGPUAnalysis = () =>
  useAppSelector((state) => state.settings.webGPUAnalysis);
export const useToggleWebGPUAnalysis = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(toggleWebGPUAnalysis()), [dispatch]);
};

export const useSetAnalysisState = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (
      analysis: HoldsTable,
      analysisTime: number,
      handIdx: number,
      variant: VARIANT
    ) => {
      dispatch(
        setCurrentAnalysis({
          analysis,
          analysisTime,
          handIdx,
          variant,
        })
      );
    },
    [dispatch]
  );
};

export const useOptimalHolds = () => {
  const currentAnalysis = useCurrentAnalysis();
  if (currentAnalysis.analysisTime > 0) {
    const { holdsTable } = currentAnalysis;
    const allPayouts = holdsTable.map(
      ([_, { expectedPayout }]) => expectedPayout
    );

    const bestValue = Math.max(...allPayouts);
    const bestHolds = holdsTable.filter(
      (hold) => hold[1].expectedPayout === bestValue
    );
    return bestHolds.map((hold) => hold[0]);
  }
  return null;
};

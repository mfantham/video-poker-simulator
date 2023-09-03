import {
  useBetSize,
  useHolds,
  useSetStage,
  useSpeed,
  useStage,
  useWin,
} from "../redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { GHand } from "./gHand";
import { Stages } from "../redux/types";
import { Hand } from "../types/hand";
import { HidePattern } from "../types/HidePattern";
import { sleep } from "../utils/sleep";
import { N_HANDS } from "../types/variant";

export const HandDealer = ({
  hand,
  nHands = 1,
}: {
  hand: Hand;
  nHands?: N_HANDS;
}) => {
  const speed = useSpeed();
  const stage = useStage();
  const holds = useHolds();
  const setStage = useSetStage();

  const { winAmount } = useWin();
  const betSize = useBetSize();
  const winPay = betSize * winAmount;

  const TIMEOUT = 300 / (1 + speed);

  const [hides, setHides] = useState<Array<HidePattern>>(
    Array(nHands)
      .fill(0)
      .map(() => [true, true, true, true, true])
  );

  const dealCards = useCallback(async () => {
    for (let i = -1; i < 5; i++) {
      const hand0Hides = [...Array(5).fill(true)].map((_, idx) => {
        return idx > i;
      }) as HidePattern;

      if (i > -1) dispatchEvent(new CustomEvent("deal-card"));
      const newHides = [hand0Hides, ...Array(nHands - 1).fill(true)];
      setHides(newHides);

      if (i < 4) await sleep(TIMEOUT);
    }

    setStage(Stages.DEALT);
  }, [TIMEOUT, nHands, setStage]);

  const dealHoldReplacements = useCallback(async () => {
    // Need to repeat this for all nHands now.
    const flips = holds.map((v) => !v) as HidePattern;
    setHides(new Array(nHands).fill([...flips]));
    for (let h = 0; h < nHands; h++) {
      for (let i = 0; i < 5; i++) {
        if (flips[i]) {
          await sleep(TIMEOUT);
          const newHides = Array(nHands)
            .fill([])
            .map((_, hIdx) => {
              const flippedHand = flips.map((flip, idx) => {
                if (hIdx < h) return false;
                if (hIdx > h) return flip;
                if (flip) return idx > i;
                else return flip;
              }) as HidePattern;
              dispatchEvent(new CustomEvent("deal-card"));
              return flippedHand;
            });
          setHides(newHides);
        }
      }
    }
    setStage(Stages.PAYING);
  }, [holds, nHands, setStage, TIMEOUT]);

  useEffect(() => {
    switch (stage) {
      case Stages.PREGAME:
        setHides(
          Array(nHands)
            .fill([])
            .map(() => [true, true, true, true, true])
        );
        break;
      case Stages.DEALING:
        dealCards();
        break;
      case Stages.DRAWING:
        dealHoldReplacements();
        break;
      case Stages.PAYING:
        if (winPay > 0) {
          dispatchEvent(new CustomEvent("pay-out", { detail: winPay }));
        }
        setStage(Stages.PAID);
        break;
    }
  }, [
    dealCards,
    dealHoldReplacements,
    holds,
    nHands,
    setStage,
    speed,
    stage,
    winPay,
  ]);

  const multiHands: Array<Hand> = new Array(nHands).fill(0).map((_, idx) => {
    // Something more interesting soon!
    return [...hand];
  });

  const outHands = multiHands.map((handN, idx) => {
    let hidePattern = hides[idx];
    if (idx !== 0) {
      if (stage === Stages.DEALT) {
        hidePattern = holds.map((v) => !v) as HidePattern;
      } else if (stage < Stages.DEALT) {
        hidePattern = [true, true, true, true, true];
      }
    }

    return (
      <GHand
        key={idx}
        hand={handN}
        editable={false}
        hide={hidePattern}
        holdable={stage === Stages.DEALT}
      />
    );
  });

  return <>{outHands}</>;
};

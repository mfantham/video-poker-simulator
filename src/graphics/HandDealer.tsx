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

export const HandDealer = ({ hand }: { hand: Hand }) => {
  const speed = useSpeed();
  const stage = useStage();
  const holds = useHolds();
  const setStage = useSetStage();

  const { winAmount } = useWin();
  const betSize = useBetSize();
  const winPay = betSize * winAmount;

  const TIMEOUT = 300 / (1 + speed);

  const [hides, setHides] = useState<HidePattern>([
    true,
    true,
    true,
    true,
    true,
  ]);

  const dealCards = useCallback(async () => {
    for (let i = -1; i < 5; i++) {
      const newHides = [...Array(5).fill(true)].map((_, idx) => {
        return idx > i;
      }) as HidePattern;

      if (i > -1) dispatchEvent(new CustomEvent("deal-card"));
      setHides(newHides);
      if (i < 4) await sleep(TIMEOUT);
    }
    setStage(Stages.DEALT);
  }, [TIMEOUT, setStage]);

  const dealHoldReplacements = useCallback(async () => {
    const flips = holds.map((v) => !v) as HidePattern;
    setHides(flips);
    for (let i = 0; i < 5; i++) {
      if (flips[i]) {
        await sleep(TIMEOUT);
        const newHides = flips.map((flip, idx) => {
          if (flip) return idx > i;
          else return flip;
        }) as HidePattern;
        dispatchEvent(new CustomEvent("deal-card"));
        setHides(newHides);
      }
    }
    setStage(Stages.PAYING);
  }, [TIMEOUT, setStage, holds]);

  useEffect(() => {
    switch (stage) {
      case Stages.PREGAME:
        setHides([true, true, true, true, true]);
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
  }, [dealCards, dealHoldReplacements, holds, setStage, speed, stage, winPay]);

  return (
    <GHand
      hand={hand}
      editable={false}
      hide={hides}
      holdable={stage === Stages.DEALT}
    />
  );
};

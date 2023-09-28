import {
  useCurrentHands,
  useHolds,
  usePay,
  useSetStage,
  useSetWinN,
  useSpeed,
  useStage,
  useVariant,
  useWins,
} from "../redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { GHand } from "./gHand";
import { Stages } from "../redux/types";
import { HidePattern } from "../types/HidePattern";
import { sleep } from "../utils/sleep";
import { N_HANDS } from "../types/variant";
import { calculateWins } from "../payoutCalculations";
import { MultiHandHolder } from "./MultiHandHolder";

export const HandDealer = ({ nHands = 1 }: { nHands?: N_HANDS }) => {
  const speed = useSpeed();
  const stage = useStage();
  const holds = useHolds();
  const setStage = useSetStage();
  const hands = useCurrentHands();
  const variant = useVariant();

  const wins = useWins();
  const setWinN = useSetWinN();
  const { payAmount } = usePay();

  let TIMEOUT = 300 / (1 + speed);

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
    const flips = holds.map((v) => !v) as HidePattern;
    setHides(new Array(nHands).fill([...flips]));
    for (let h = 0; h < nHands; h++) {
      if (nHands < N_HANDS.TEN) {
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
      } else {
        await sleep(TIMEOUT);
        const newHides = Array(nHands)
          .fill([])
          .map((_, hIdx) => {
            const flippedHand = flips.map((flip) => {
              if (hIdx <= h) return false;
              else return flip;
            }) as HidePattern;
            dispatchEvent(new CustomEvent("deal-card"));
            return flippedHand;
          });
        setHides(newHides);
      }
      const isWin = calculateWins(hands[h].hand, variant);
      if (!!isWin) {
        dispatchEvent(new CustomEvent("individual-hand-win"));
        setWinN(isWin, h);
      }
    }
    setStage(Stages.PAYING);
  }, [holds, nHands, setStage, hands, variant, TIMEOUT, setWinN]);

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
        if (payAmount > 0) {
          dispatchEvent(new CustomEvent("pay-out", { detail: payAmount }));
        }
        setStage(Stages.PAID);
        break;
    }
  }, [
    dealCards,
    dealHoldReplacements,
    holds,
    nHands,
    payAmount,
    setStage,
    speed,
    stage,
  ]);

  const outHands = hands.map((handInfo, idx) => {
    const handN = stage === Stages.DEALT ? hands[0].hand : handInfo.hand;
    let hidePattern = hides[idx];
    if (idx !== 0) {
      if (stage === Stages.DEALT) {
        hidePattern = holds.map((v) => !v) as HidePattern;
      } else if (stage < Stages.DEALT) {
        hidePattern = [true, true, true, true, true];
      }
    }

    const win =
      wins[idx]?.winAmount > 0 &&
      stage >= Stages.DEALING &&
      nHands > N_HANDS.ONE &&
      hidePattern.every((h) => !h)
        ? wins[idx]
        : undefined;

    const mini = idx !== 0 && nHands > N_HANDS.TEN;

    return (
      <GHand
        key={idx}
        hand={handN}
        editable={false}
        hide={hidePattern}
        holdable={stage === Stages.DEALT}
        win={win}
        mini={mini}
      />
    );
  });

  return <MultiHandHolder nHands={nHands}>{outHands}</MultiHandHolder>;
};

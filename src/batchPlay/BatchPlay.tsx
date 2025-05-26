import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

import { deal } from "../mechanics/deal";
import { HistoryGraph } from "./HistoryGraph";
import { HandHistory } from "./HandHistory";
import { initialState } from "../redux/statsSlice";
import { evaluateBestHolds } from "../strategy/evaluateHand";
import { VARIANT } from "../types/variant";
import { handToHandIdx } from "../utils/handToHandIdx";
import { useSetStage, useVariant, useWebGPUAnalysis } from "../redux/hooks";
import { VariantSelector } from "../gameScreens/VariantSelector";
import { Hand } from "../types/hand";
import { GameResult } from "../types/GameResult";
import { Stages } from "../redux/types";
import { calculatePayout } from "../payoutCalculations";
import { sortHand } from "../utils/sortHand";
import { MenuButton } from "../gameScreens/menu/MenuButton";

const initialCoins = initialState.coins;
const costOfGame = 1;

const ButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
`;

const AutoplayControlsHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px 250px;
`;

const ProgressHolder = styled.div`
  width: 52px;
  height: 52px;
`;

const ResultsHolder = styled.div`
  font-size: 24px;
  [id*="MuiCircularProgress"] {
    transition: none;
  }
`;

const playHandOptimally = async (variant: VARIANT, useWebGPU: boolean = true): Promise<GameResult> => {
  const [dealtHand, currentDeck] = deal();
  const handId = handToHandIdx(dealtHand);
  const { bestHold, bestExpectedPayout } = await evaluateBestHolds(
    handId,
    variant,
    useWebGPU
  );
  // best hold works on sorted hand...
  const { sortedHand, sortIndex } = sortHand(dealtHand);
  const newHandSorted = [...sortedHand] as Hand;
  bestHold.split("").forEach((hold, idx) => {
    if (hold === "0") {
      newHandSorted[idx] = currentDeck[idx + 5];
    }
  });

  const payout = calculatePayout(newHandSorted, variant);
  const newHand = sortIndex.map((idx) => newHandSorted[idx]) as Hand;
  return {
    payout,
    expectedPayout: bestExpectedPayout,
    dealtHand,
    newHand,
  };
};

const PlayGamesButtons = ({ callback }: { callback: Function }) => {
  const nGamesOptions = [100, 1000];
  const buttons = nGamesOptions.map((n, idx) => {
    return (
      <>
        <MenuButton
          key={idx}
          onClick={() => callback(n)}
          title={`Play ${n} games`}
        >
          {n}X
        </MenuButton>
      </>
    );
  });
  return <>{buttons}</>;
};

export const BatchPlay = () => {
  const variant = useVariant();
  const setStage = useSetStage();
  const useWebGPU = useWebGPUAnalysis();
  const [progress, setProgress] = useState<number>(100);
  const [history, setHistory] = useState<Array<GameResult>>([]);
  const [coinsHistory, setCoinsHistory] = useState<Array<number>>([
    initialCoins,
  ]);
  const [expectedHistory, setExpectedHistory] = useState<Array<number>>([
    initialCoins,
  ]);

  const handleClick = useCallback(
    async (n = 100) => {
      for (let i = 0; i < n; i++) {
        // Play 1 game at a time so that history updates
        const result = await playHandOptimally(variant, useWebGPU);
        setHistory((s) => [...s, result]);
        setCoinsHistory((s) => [
          ...s,
          (s.at(-1) ?? 0) + result.payout - costOfGame,
        ]);
        setExpectedHistory((s) => [
          ...s,
          (s.at(-1) ?? 0) + result.expectedPayout - costOfGame,
        ]);
        setProgress(1 + (100 * i) / n);
      }
    },
    [variant]
  );

  const handleReset = useCallback(() => {
    setHistory([]);
    setCoinsHistory([initialCoins]);
    setExpectedHistory([initialCoins]);
    setProgress(100);
  }, []);

  useEffect(() => {
    setStage(Stages.EXPLORER);
  }, [setStage]);

  useEffect(() => {
    handleReset();
  }, [handleReset, variant]);

  const coins = coinsHistory.at(-1) ?? initialCoins;
  const expectedCoins = expectedHistory.at(-1) ?? initialCoins;

  const returnOnInvestment = useMemo(() => {
    const turnover = history.length * costOfGame;
    const amountWon = history.reduce((acc, { payout }) => acc + payout, 0);
    const expectedWin = history.reduce(
      (acc, { expectedPayout }) => acc + expectedPayout,
      0
    );
    const returnToPlayer = amountWon / turnover;
    const expectedReturnToPlayer = expectedWin / turnover;
    return {
      rtp: 100 * returnToPlayer,
      expectedRTP: 100 * expectedReturnToPlayer,
    };
  }, [history]);

  return (
    <>
      <AutoplayControlsHolder>
        <ButtonsHolder>
          <PlayGamesButtons callback={handleClick} />
          <ProgressHolder>
            {progress < 100 && (
              <CircularProgress variant="determinate" value={progress} />
            )}
          </ProgressHolder>
          <MenuButton onClick={handleReset} title="Reset stats">
            Reset
          </MenuButton>
          <VariantSelector />
        </ButtonsHolder>
        <ResultsHolder>
          Games: {history.length}
          <br />
          Coins: {coins.toFixed(0)}
          <br />
          Exp. coins: {expectedCoins.toFixed(0)}
        </ResultsHolder>
        <ResultsHolder>
          RTP:{" "}
          {isNaN(returnOnInvestment.rtp)
            ? "--"
            : returnOnInvestment.rtp.toFixed(3)}
          %
          <br />
          Exp. RTP:{" "}
          {isNaN(returnOnInvestment.expectedRTP)
            ? "--"
            : returnOnInvestment.expectedRTP.toFixed(3)}
          %
          <br />
          Luck: {((100 * coins) / expectedCoins).toFixed(3)}%
        </ResultsHolder>
      </AutoplayControlsHolder>
      <HistoryGraph coinsHistory={coinsHistory} expected={expectedHistory} />
      <HandHistory history={history} />
    </>
  );
};

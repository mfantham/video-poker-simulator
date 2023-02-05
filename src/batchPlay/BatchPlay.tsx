import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

import { deal } from "../mechanics/deal";
import { calculatePayout } from "../payoutCalculations/dumb-luck/calculatePayout";
import { costOfGame } from "../payoutCalculations/dumb-luck/payout";
import { HistoryGraph } from "./HistoryGraph";
import { initialState } from "../redux/reducers";
import { evaluateBestHolds } from "../strategy/evaluateHand";
import { VARIANT } from "../types/variant";
import { handToHandIdx } from "../utils/handToHandIdx";
import { useVariant } from "../redux/hooks";
import { VariantSelector } from "../gameScreens/VariantSelector";
import { Hand } from "../types/hand";

type GameResult = {
  payout: number;
  dealtHand: Hand;
  newHand: Hand;
};

const initialCoins = initialState.coins;

const ButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ResultsHolder = styled.p`
  [id*="MuiCircularProgress"] {
    transition: none;
  }
`;

const playHandOptimally = async (variant: VARIANT): Promise<GameResult> => {
  const [dealtHand, currentDeck] = deal();
  const handId = handToHandIdx(dealtHand);
  const { bestHold } = await evaluateBestHolds(handId, variant);
  const newHand = [...dealtHand] as Hand;
  for (let i = 0; i < bestHold.length; i++) {
    if (bestHold[i] === "0") {
      newHand[i] = currentDeck[i + 5];
    }
  }
  const payout = calculatePayout(newHand);

  return { payout, dealtHand, newHand };
};

const PlayGamesButtons = ({ callback }: { callback: Function }) => {
  const nGamesOptions = [100, 1000, 1e5, 1e6];
  const buttons = nGamesOptions.map((n, idx) => {
    return (
      <button key={idx} onClick={() => callback(n)}>
        Play {n} games
      </button>
    );
  });
  return <ButtonsHolder>{buttons}</ButtonsHolder>;
};

export const BatchPlay = () => {
  const variant = useVariant();
  const [progress, setProgress] = useState<number>(100);
  const [history, setHistory] = useState<Array<GameResult>>([]);
  const [coinsHistory, setCoinsHistory] = useState<Array<number>>([
    initialCoins,
  ]);

  const handleClick = useCallback(
    async (n = 100) => {
      for (let i = 0; i < n; i++) {
        // Play 1 game at a time so that history updates
        const result = await playHandOptimally(variant);
        setHistory((s) => [...s, result]);
        setCoinsHistory((s) => [...s, (s.at(-1) ?? 0) + result.payout - 1]);
        setProgress(1 + (100 * i) / n);
      }
    },
    [variant]
  );

  useEffect(() => {
    // Play 100 games on startup
    handleClick(100);
  }, []);

  const coins = coinsHistory.at(-1) ?? initialCoins;

  const returnOnInvestment = useMemo(() => {
    const amountInvested = (history.length - 1) * costOfGame;
    const amountWon = coins - initialCoins + amountInvested; // amount actually won includes investment
    return (100 * amountWon) / amountInvested;
  }, [history, coins]);

  return (
    <>
      <PlayGamesButtons callback={handleClick} />
      <VariantSelector />
      <ResultsHolder>
        Games: {history.length - 1}
        <br />
        Coins: {coins.toFixed(0)}
        <br />
        Return: {returnOnInvestment.toFixed(3)}%
        {progress < 100 && (
          <>
            <br />
            <CircularProgress variant="determinate" value={progress} />
          </>
        )}
      </ResultsHolder>
      <HistoryGraph history={coinsHistory} />
    </>
  );
};

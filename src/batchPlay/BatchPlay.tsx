import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { deal } from "../mechanics/deal";
import { calculatePayout } from "../payoutCalculations/dumb-luck/calculatePayout";
import { costOfGame } from "../payoutCalculations/dumb-luck/payout";
import { HistoryGraph } from "./HistoryGraph";
import { initialState } from "../redux/reducers";

const initialCoins = initialState.coins;

const ButtonsHolder = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const playNGames = (n = 100, startingCoin = initialCoins) => {
  let localHistory = [startingCoin];
  for (let i = 1; i <= n; i++) {
    const newHand = deal();
    const netPayout = calculatePayout(newHand) - costOfGame;
    localHistory.push(localHistory[i - 1] + netPayout);
  }
  return localHistory;
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
  const [history, setHistory] = useState<Array<number>>([initialCoins]);
  const lastCoin = useMemo(() => {
    return history?.[history.length - 1] ?? initialCoins;
  }, [history]);

  const handleClick = useCallback(
    (n = 100) => {
      const latestHistory = playNGames(n, lastCoin);
      setHistory((s) => [...s, ...latestHistory.slice(1)]);
    },
    [lastCoin]
  );

  useEffect(() => {
    // Play 100 games on startup
    const latestHistory = playNGames(100, initialCoins);
    setHistory((s) => [...s, ...latestHistory.slice(1)]);
  }, []);

  const returnOnInvestment = useMemo(() => {
    const amountInvested = (history.length - 1) * costOfGame;
    const amountWon = lastCoin - 1000 + amountInvested; // amount actually won includes investment
    return (100 * amountWon) / amountInvested;
  }, [history, lastCoin]);

  return (
    <>
      <PlayGamesButtons callback={handleClick} />
      <p>
        Games: {history.length - 1}
        <br />
        Coins: {lastCoin.toFixed(0)}
        <br />
        Return: {returnOnInvestment.toFixed(3)}%
      </p>
      <HistoryGraph history={history} />
    </>
  );
};

import styled from "styled-components";

import { GameResult } from "../types/GameResult";
import { GHand } from "../graphics/gHand";
import React, { ChangeEvent, useMemo, useState } from "react";

const HistoryHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: auto;
`;

const ResultHolder = styled.div`
  display: grid;
  width: 140px;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
`;

export const HandHistory = ({ history }: { history: Array<GameResult> }) => {
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(1);

  const numberOfHands = history.length;
  const selectedHistory = useMemo(
    () => history?.[selectedHistoryIndex - 1],
    // hmm.
    [history, selectedHistoryIndex]
  );

  if (numberOfHands === 0) {
    return null;
  }

  const { dealtHand, newHand, payout } = selectedHistory;

  return (
    <div>
      <input
        type="number"
        min={1}
        max={numberOfHands}
        value={selectedHistoryIndex}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setSelectedHistoryIndex(Number(e.target.value))
        }
        style={{ fontSize: 24 }}
      />
      <ResultHolder>
        <GHand hand={dealtHand} mini={true} />
        <div>
          <span className="material-symbols-rounded">arrow_downward</span>{" "}
          {payout ? `Win: ${payout}` : "No win"}
        </div>
        <GHand hand={newHand} mini={true} />
      </ResultHolder>
    </div>
  );
};

export const FullHandHistory = ({
  history,
}: {
  history: Array<GameResult>;
}) => {
  // This really slows down the UI after 100 hands or so
  const historyList = history.map(({ dealtHand, newHand, payout }, idx) => {
    return (
      <ResultHolder key={idx}>
        <GHand hand={dealtHand} mini={true} />
        <div>
          <span className="material-symbols-rounded">arrow_downward</span>{" "}
          {payout ? `Win: ${payout}` : "No win"}
        </div>
        <GHand hand={newHand} mini={true} />
      </ResultHolder>
    );
  });
  return <HistoryHolder>{historyList}</HistoryHolder>;
};

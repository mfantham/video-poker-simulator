import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";
import { useHolds, useStage, useToggleHold } from "../redux/hooks";
import { Stages } from "../redux/types";
import { HidePattern } from "../types/HidePattern";
import { useCallback, useEffect } from "react";

const HandHolder = styled.div<{ mini: boolean }>`
  display: flex;
  gap: ${(p) => (p.mini ? "2px" : "10px")};
  margin: auto;
`;

const HandHolder2 = styled.div`
  display: flex;
  justify-content: center;
`;

export const GHand = ({
  hand,
  editable = false,
  holdable = false,
  hide = [false, false, false, false, false],
  mini = false,
  fixedHolds = undefined,
}: {
  hand: Hand;
  editable?: boolean;
  holdable?: boolean;
  hide?: HidePattern;
  mini?: boolean;
  fixedHolds?: HidePattern;
}) => {
  const toggleHold = useToggleHold();
  const holds = useHolds();
  const stage = useStage();
  const hidden = stage === Stages.PREGAME;
  if (hidden) {
    hide = [true, true, true, true, true];
  }

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (holdable && ["1", "2", "3", "4", "5"].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        toggleHold(idx);
      }
    },
    [holdable, toggleHold]
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  });

  const cards = hand.map((card, idx) => {
    const holdCallback = (idx: number) => {
      if (holdable) toggleHold(idx);
    };

    return (
      <GCard
        key={idx}
        mini={mini}
        card={card}
        hidden={hide[idx]}
        editable={editable}
        holdable={holdable}
        hold={fixedHolds?.[idx] ?? holds[idx]}
        holdCallback={() => holdCallback(idx)}
      />
    );
  });

  if (mini) {
    return <HandHolder mini={mini}>{cards}</HandHolder>;
  }

  return (
    <Grid2
      container
      spacing={{ xs: 0.5, sm: 1 }}
      sx={{
        maxWidth: { md: "650px" },
        marginLeft: { md: "calc(50% - 650px / 2)" },
      }}
    >
      {cards}
    </Grid2>
  );
};

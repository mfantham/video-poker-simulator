import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";
import { useHolds, useStage, useToggleHold } from "../redux/hooks";
import { Stages } from "../redux/types";
import { HidePattern } from "../types/HidePattern";

const HandHolder = styled.div<{ mini: boolean }>`
  display: flex;
  gap: ${(p) => (p.mini ? "2px" : "10px")};
  margin: auto;
`;

export const GHand = ({
  hand,
  editable = false,
  holdable = false,
  hide = [false, false, false, false, false],
  mini = false,
}: {
  hand: Hand;
  editable?: boolean;
  holdable?: boolean;
  hide?: HidePattern;
  mini?: boolean;
}) => {
  const toggleHold = useToggleHold();
  const holds = useHolds();
  const stage = useStage();
  const hidden = stage === Stages.PREGAME;
  if (hidden) {
    hide = [true, true, true, true, true];
  }

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
        hold={holds[idx]}
        holdCallback={() => holdCallback(idx)}
      />
    );
  });
  return <HandHolder mini={mini}>{cards}</HandHolder>;
};

import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";
import { useHolds, useToggleHold } from "../redux/hooks";

const HandHolder = styled.div`
  display: flex;
  gap: 10px;
`;

export const GHand = ({
  hand,
  editable = false,
  holdable = false,
}: {
  hand: Hand;
  editable?: boolean;
  holdable?: boolean;
}) => {
  const toggleHold = useToggleHold();
  const holds = useHolds();

  const cards = hand.map((card, idx) => {
    const holdCallback = (idx: number) => {
      if (holdable) toggleHold(idx);
    };

    return (
      <GCard
        key={idx}
        card={card}
        editable={editable}
        holdable={holdable}
        hold={holds[idx]}
        holdCallback={() => holdCallback(idx)}
      />
    );
  });
  return <HandHolder>{cards}</HandHolder>;
};

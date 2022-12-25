import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";

const HandHolder = styled.div`
  display: flex;
  gap: 10px;
`;

export const GHand = ({
  hand,
  editable,
}: {
  hand: Hand;
  editable: boolean;
}) => {
  const cards = hand.map((card, idx) => {
    return <GCard key={idx} card={card} editable={editable} />;
  });
  return <HandHolder>{cards}</HandHolder>;
};

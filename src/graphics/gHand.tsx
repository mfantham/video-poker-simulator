import { Hand } from "../types/hand";
import { GCard } from "./gCard";
import styled from "styled-components";

const HandHolder = styled.div`
  display: flex;
  gap: 10px;
`;

export const GHand = ({ hand }: { hand: Hand }) => {
  const cards = hand.map((card, idx) => {
    return <GCard key={idx} card={card} />;
  });
  return <HandHolder>{cards}</HandHolder>;
};

import { ReactElement } from "react";
import styled from "styled-components";
import { Card } from "../types/card";
import { valueToFaceCard } from "../utils/valueToFaceCard";

const CardDiv = styled.div`
  background: white;
  border: black solid 4px;
  border-radius: 20px;
  height: 200px;
  width: 123px;
  display: grid;
`;

const TextSpan = styled.span`
  fontsize: 30px;
`;

const gSuit = {
  0: "♣",
  1: "♦",
  2: "♥",
  3: "♠",
};

const cSuit = {
  0: "black",
  1: "red",
  2: "red",
  3: "black",
};

export const GCard = ({ card }: { card: Card }): ReactElement => {
  const { value, suit } = card;
  const suitSymbol = gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);

  return (
    <CardDiv>
      <TextSpan style={{ color: suitColor }}>
        {cardValue}
        {suitSymbol}
      </TextSpan>
    </CardDiv>
  );
};

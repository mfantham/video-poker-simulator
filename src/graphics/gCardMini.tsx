import { ReactElement } from "react";
import styled from "styled-components";
import { Card } from "../types/card";
import { valueToFaceCard } from "../utils/valueToFaceCard";
import { useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";

const CardDiv = styled.div<{ holdable?: boolean }>`
  background: white;
  position: relative;
  border: black solid 1px;
  border-radius: 5px;
  height: 40px;
  width: 24px;
  display: grid;
  user-select: none;
  ${(p) => p.holdable && "cursor: pointer;"}
`;

const HiddenDiv = styled.div`
  background: radial-gradient(red, mediumpurple);
  position: absolute;
  inset: 1px;
  border-radius: 3px;
`;

const TextSpan = styled.span`
  font-size: 14px;
  line-height: 10px;
  margin-top: 10px;
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

export const GCardMini = ({
  card,
  holdable,
  hold,
  holdCallback,
  hidden,
}: {
  card: Card;
  holdCallback?: () => void;
  hold?: boolean;
  holdable?: boolean;
  hidden?: boolean;
}): ReactElement => {
  const variant = useVariant();

  const { value, suit } = card;
  const suitSymbol =
    variant === VARIANT.DEUCES_WILD && value === 2 ? "W" : gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);

  return (
    <CardDiv onClick={holdCallback} holdable={holdable}>
      {hidden ? (
        <HiddenDiv />
      ) : (
        <TextSpan style={{ color: suitColor }}>
          {cardValue}
          <br />
          {suitSymbol}
        </TextSpan>
      )}
    </CardDiv>
  );
};

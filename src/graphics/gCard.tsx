import { ReactElement } from "react";
import styled from "styled-components";
import { Card } from "../types/card";
import { valueToFaceCard } from "../utils/valueToFaceCard";
import { useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";
import Select from "react-select";
import King from "./King.svg";
import Queen from "./Queen.svg";
import { Jack } from "./Jack.jsx";

const CardDiv = styled.div<{ holdable?: boolean }>`
  background: white;
  border: black solid 4px;
  border-radius: 20px;
  height: 200px;
  width: 123px;
  display: grid;
  ${(p) => p.holdable && "cursor: pointer;"}
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

const NumberSelect = () => {
  const options = new Array(13).fill(0).map((_, idx) => ({
    value: idx,
    label: valueToFaceCard(idx),
  }));

  return <Select options={options} />;
};

const GFace = ({ value }: { value: number }) => {
  const variant = useVariant();

  switch (value) {
    case 13:
      return <img src={King} alt="" />;
    case 12:
      return <img src={Queen} alt="" />;
    case 11:
      return <Jack style={{ width: "100%" }} />;
    case 2:
      if (variant === VARIANT.DEUCES_WILD) {
        return (
          <div>
            WILD
            <br />
            Wild
            <br />
            wild
          </div>
        );
      } else return null;

    default:
      return null;
  }
};

export const GCard = ({
  card,
  editable,
  holdable,
  hold,
  holdCallback,
}: {
  card: Card;
  editable?: boolean;
  holdable?: boolean;
  hold?: boolean;
  holdCallback?: () => void;
}): ReactElement => {
  const { value, suit } = card;
  const suitSymbol = gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);

  return (
    <CardDiv onClick={holdCallback} holdable={holdable}>
      <TextSpan style={{ color: suitColor }}>
        {cardValue}
        {suitSymbol}
        <GFace value={card.value} />
        {holdable && hold && "HOLD"}
      </TextSpan>
    </CardDiv>
  );
};

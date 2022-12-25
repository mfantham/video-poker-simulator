import { ReactElement } from "react";
import styled from "styled-components";
import { Card } from "../types/card";
import { valueToFaceCard } from "../utils/valueToFaceCard";
import { useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";
import Select from "react-select";

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

const NumberSelect = () => {
  const options = new Array(13).fill(0).map((_, idx) => ({
    value: idx,
    label: valueToFaceCard(idx),
  }));

  return <Select options={options} />;
};

export const GCard = ({
  card,
  editable,
}: {
  card: Card;
  editable: boolean;
}): ReactElement => {
  const { value, suit } = card;
  const suitSymbol = gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);
  const variant = useVariant();
  const wild = variant === VARIANT.DEUCES_WILD && value === 2;

  return (
    <CardDiv>
      <TextSpan style={{ color: suitColor }}>
        {cardValue}
        {suitSymbol}
        {wild && <div>WILD</div>}
      </TextSpan>
    </CardDiv>
  );
};

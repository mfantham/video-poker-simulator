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
  position: relative;
  border: black solid 4px;
  border-radius: 20px;
  height: 200px;
  width: 123px;
  display: grid;
  user-select: none;
  ${(p) => p.holdable && "cursor: pointer;"}
`;

const HiddenDiv = styled.div`
  background: radial-gradient(red, mediumpurple);
  position: absolute;
  inset: 3px;
  border-radius: 13px;
`;

const TextSpan = styled.span`
  font-size: 30px;
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

const Hold = styled.div`
  position: absolute;
  bottom: 20px;
  left: 15px;
  color: #003f8b;
  font-weight: bold;
  text-shadow: 0 0 0.5em #ffb851;
`;

export const GCard = ({
  card,
  editable,
  holdable,
  hold,
  holdCallback,
  hidden,
}: {
  card: Card;
  editable?: boolean;
  holdable?: boolean;
  hold?: boolean;
  holdCallback?: () => void;
  hidden?: boolean;
}): ReactElement => {
  const { value, suit } = card;
  const suitSymbol = gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);

  return (
    <CardDiv onClick={holdCallback} holdable={holdable}>
      {hidden ? (
        <HiddenDiv />
      ) : (
        <TextSpan style={{ color: suitColor }}>
          {cardValue}
          {suitSymbol}
          <GFace value={card.value} />
          {holdable && hold && <Hold>HOLD</Hold>}
        </TextSpan>
      )}
    </CardDiv>
  );
};

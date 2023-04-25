import { ReactElement } from "react";
import styled from "styled-components";
import Grid2 from "@mui/material/Unstable_Grid2";

import { Card } from "../types/card";
import { valueToFaceCard } from "../utils/valueToFaceCard";
import { useVariant } from "../redux/hooks";
import { VARIANT } from "../types/variant";
import Select from "react-select";
import King from "./King.svg";
import Queen from "./Queen.svg";
import { Jack } from "./Jack.jsx";
import { GCardMini } from "./gCardMini";
import { DRAWER_WIDTH } from "../gameScreens/home/LayoutConstants";
import { Box } from "@mui/material";

const CardDiv = styled(Box)<{ holdable?: boolean }>`
  background: white;
  position: relative;
  border: black solid 4px;
  border-radius: 20px;
  height: 100%;
  display: grid;
  user-select: none;
  ${(p) => p.holdable && "cursor: pointer;"}
`;

const BackOfCard = styled(Box)`
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
  mini,
}: {
  card: Card;
  editable?: boolean;
  holdable?: boolean;
  hold?: boolean;
  holdCallback?: () => void;
  hidden?: boolean;
  mini?: boolean;
}): ReactElement => {
  const { value, suit } = card;
  const suitSymbol = gSuit[suit];
  const suitColor = cSuit[suit];
  const cardValue = valueToFaceCard(value);

  if (mini) {
    return (
      <GCardMini
        card={card}
        holdable={holdable}
        hold={hold}
        hidden={hidden}
        holdCallback={holdCallback}
      />
    );
  }

  return (
    <Grid2
      xs
      sx={{
        height: { xs: "30vw", sm: `calc(0.3 * (100vw - ${DRAWER_WIDTH}px))` },
      }}
    >
      <CardDiv
        sx={{
          borderRadius: {
            xs: "3vw",
            sm: `calc(0.03 * (100vw - ${DRAWER_WIDTH}px))`,
          },
        }}
        onClick={holdCallback}
        holdable={holdable}
      >
        {hidden ? (
          <BackOfCard
            sx={{
              borderRadius: {
                xs: "calc(3vw - 7px)",
                sm: `calc(0.03 * (100vw - ${DRAWER_WIDTH}px) - 7px)`,
              },
            }}
          />
        ) : (
          <TextSpan style={{ color: suitColor }}>
            {cardValue}
            {suitSymbol}
            <GFace value={card.value} />
            {holdable && hold && <Hold>HOLD</Hold>}
          </TextSpan>
        )}
      </CardDiv>
    </Grid2>
  );
};

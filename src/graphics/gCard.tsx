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
  overflow: hidden;
  ${(p) => p.holdable && "cursor: pointer;"}
`;

const BackOfCard = styled(Box)`
  background: radial-gradient(red, mediumpurple);
  position: absolute;
  inset: 3px;
  border-radius: 13px;
`;

const FrontOfCard = styled(Box)`
  position: absolute;
  inset: 0;
  font-size: min(30px, 5vw);
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
  left: calc(50% - 4.2vw);
  color: #003f8b;
  font-size: 3vw;
  font-weight: bold;
  text-shadow: 0 0 0.5em #ffb851;
`;

const Optimal = styled.div`
  position: absolute;
  top: 0;
  left: 0em;
  color: #ffb851;
  font-size: 3vw;
  font-weight: 1000;
  text-shadow: 0 0 0.5em #ffb851;
`;

export const GCard = ({
  card,
  editable,
  optimal,
  holdable,
  hold,
  holdCallback,
  hidden,
  mini,
}: {
  card: Card;
  editable?: boolean;
  holdable?: boolean;
  optimal?: boolean;
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

  // The card size should be based solely on its container.
  // Then the container can be based on screen size, grids, etc

  return (
    <Grid2
      sx={{
        width: "19%",
        aspectRatio: "0.666",
      }}
    >
      <CardDiv
        sx={{
          borderRadius: {
            xs: "3vw",
            sm: `calc(0.03 * (100vw - ${DRAWER_WIDTH}px))`,
            md: "20px",
          },
          width: "100%",
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
                md: "13px",
              },
            }}
          />
        ) : (
          <FrontOfCard style={{ color: suitColor }}>
            {cardValue}
            {suitSymbol}
            <GFace value={card.value} />
            {holdable && hold && <Hold>HOLD</Hold>}
            {optimal && <Optimal>☆</Optimal>}
          </FrontOfCard>
        )}
      </CardDiv>
    </Grid2>
  );
};

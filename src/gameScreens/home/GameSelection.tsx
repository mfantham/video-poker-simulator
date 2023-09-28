import { Link, Route, Routes } from "react-router-dom";
import Grid2 from "@mui/material/Unstable_Grid2";
import styled from "styled-components";

import { SelectorSVG } from "./selectors/SelectorSVG";
import { GameVariant } from "../../types/GameVariant";
import { PlayDeucesWild } from "../games/PlayDeucesWild";
import { HandExplorer } from "../analysis/HandExplorer";
import { PlayJacks } from "../games/PlayJacks";
import { AutoPlay } from "../autoplay/AutoPlay";
import { MenuBarButtonRow } from "../menu/MenuBar";

import { Help } from "./Help";
import { CoinsPerBetButton } from "./CoinsPerBetButton";
import { Settings } from "./Settings";
import { N_HANDS } from "../../types/variant";

const PageHolder = styled.div`
  position: absolute;
  inset: 10px 10px 0 10px;
`;

const Selector = ({
  route,
  variant,
}: {
  route: string;
  variant: GameVariant;
}) => {
  return (
    <Grid2 xs={6} sm={4} md={3}>
      <Link to={route}>
        <SelectorSVG variant={variant} />
      </Link>
    </Grid2>
  );
};

type MultiOption =
  | "singlePlay"
  | "triplePlay"
  | "fivePlay"
  | "tenPlay"
  | "hundredPlay";
type Game = { route: string; variant: GameVariant; option?: MultiOption };
type GameList = Array<Game>;
type Games = Record<MultiOption, GameList>;

const games: Games = {
  singlePlay: [
    { route: `/single/deuces`, variant: GameVariant.DEUCES_WILD },
    { route: `/single/jacks`, variant: GameVariant.JACKS_OR_BETTER },
  ],
  triplePlay: [
    { route: `/triple/deuces`, variant: GameVariant.DEUCES_WILD },
    { route: `/triple/jacks`, variant: GameVariant.JACKS_OR_BETTER },
  ],
  fivePlay: [{ route: `/five/deuces`, variant: GameVariant.DEUCES_WILD }],
  tenPlay: [{ route: `/ten/deuces`, variant: GameVariant.DEUCES_WILD }],
  hundredPlay: [{ route: `/hundred/deuces`, variant: GameVariant.DEUCES_WILD }],
};

const GameSelectors = ({
  multiOption = "singlePlay",
}: {
  multiOption: MultiOption;
}) => {
  const selectors = games[multiOption].map((game) => {
    return (
      <Selector route={game.route} variant={game.variant} key={game.route} />
    );
  });
  return (
    <>
      <Grid2 container spacing={2}>
        {selectors}
      </Grid2>
      <MenuBarButtonRow style={{ height: 90 }}>
        <CoinsPerBetButton />
      </MenuBarButtonRow>
    </>
  );
};

export const GameSelection = () => {
  return (
    <PageHolder>
      <Routes>
        <Route path="" element={<GameSelectors multiOption={"singlePlay"} />} />
        <Route
          path="/single"
          element={<GameSelectors multiOption={"singlePlay"} />}
        />
        <Route path="/single/deuces" element={<PlayDeucesWild />} />
        <Route path="/single/jacks" element={<PlayJacks />} />
        <Route
          path="/triple"
          element={<GameSelectors multiOption={"triplePlay"} />}
        />
        <Route
          path="/triple/deuces"
          element={<PlayDeucesWild nHands={N_HANDS.THREE} />}
        />
        <Route
          path="/triple/jacks"
          element={<PlayJacks nHands={N_HANDS.THREE} />}
        />
        <Route
          path="/five"
          element={<GameSelectors multiOption={"fivePlay"} />}
        />
        <Route
          path="/five/deuces"
          element={<PlayDeucesWild nHands={N_HANDS.FIVE} />}
        />
        <Route
          path="/ten"
          element={<GameSelectors multiOption={"tenPlay"} />}
        />
        <Route
          path="/ten/deuces"
          element={<PlayDeucesWild nHands={N_HANDS.TEN} />}
        />
        <Route
          path="/hundred"
          element={<GameSelectors multiOption={"hundredPlay"} />}
        />
        <Route
          path="/hundred/deuces"
          element={<PlayDeucesWild nHands={N_HANDS.ONE_HUNDRED} />}
        />
        <Route path="auto" element={<AutoPlay />} />
        <Route path="analysis" element={<HandExplorer />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Routes>
    </PageHolder>
  );
};

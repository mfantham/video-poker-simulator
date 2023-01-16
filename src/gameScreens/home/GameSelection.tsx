import { Link, Route, Routes } from "react-router-dom";
import Grid2 from "@mui/material/Unstable_Grid2";
import { SelectorSVG } from "./selectors/SelectorSVG";
import { GameVariant } from "../../types/GameVariant";
import { PlayDeucesWild } from "../PlayDeucesWild";
import { HandExplorer } from "../analysis/HandExplorer";

const Selector = ({
  route,
  variant,
}: {
  route: string;
  variant: GameVariant;
}) => {
  return (
    <Grid2 xs={6} sm={3}>
      <Link to={route}>
        <SelectorSVG variant={variant} />
      </Link>
    </Grid2>
  );
};

type MultiOption = "singlePlay" | "triplePlay" | "fivePlay" | "tenPlay";
type Game = { route: string; variant: GameVariant; option?: MultiOption };
type GameList = Array<Game>;
type Games = Record<MultiOption, GameList>;

const games: Games = {
  singlePlay: [
    { route: `./deuces`, variant: GameVariant.DEUCES_WILD },
    { route: `./jacks`, variant: GameVariant.JACKS_OR_BETTER },
  ],
  triplePlay: [],
  fivePlay: [],
  tenPlay: [],
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
  return <>{selectors}</>;
};

export const GameSelection = () => {
  return (
    <Grid2 container spacing={5}>
      <Routes>
        <Route path="" element={<GameSelectors multiOption={"singlePlay"} />} />
        <Route
          path="single"
          element={<GameSelectors multiOption={"singlePlay"} />}
        />
        <Route path="single/deuces" element={<PlayDeucesWild />} />
        <Route
          path="triple"
          element={<GameSelectors multiOption={"triplePlay"} />}
        />
        <Route path="analysis" element={<HandExplorer />} />
      </Routes>
    </Grid2>
  );
};

import { GameVariant } from "../../../types/GameVariant";
import { DeucesWildTitle } from "./DeucesWildTitle";
import { JacksOrBetterTitle } from "./JacksOrBetterTitle";

const SelectorTitle = ({ variant }: { variant: GameVariant }) => {
  switch (variant) {
    case GameVariant.DEUCES_WILD:
      return <DeucesWildTitle />;
    case GameVariant.JACKS_OR_BETTER:
      return <JacksOrBetterTitle />;
    default:
      return <></>;
  }
};

export const SelectorSVG = ({ variant }: { variant: GameVariant }) => {
  return (
    <svg
      version="1.1"
      id="svg83"
      width="593.5"
      height="312"
      style={{ width: "100%", height: "100%" }}
      viewBox="0 0 593.5 312"
    >
      <rect
        style={{ fill: "#800000" }}
        id="rect409"
        width="593.5"
        height="312"
        x="0"
        y="0.00029864768"
      />
      <path
        style={{ fill: "#f19e9d" }}
        d="m 0,312.0003 25,-25 L 568.5,25.000299 593.5,2.986e-4 0,0 Z"
      />
      <rect
        style={{ fill: "#ea3323" }}
        id="rect250"
        width="543.5"
        height="262"
        x="25"
        y="25.000299"
      />
      <SelectorTitle variant={variant} />
    </svg>
  );
};

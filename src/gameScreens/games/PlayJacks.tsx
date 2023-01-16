import { useEffect } from "react";
import { useSetVariant } from "../../redux/hooks";
import { VARIANT } from "../../types/variant";
import { GameScreen } from "./GameScreen";

export const PlayJacks = () => {
  const setVariant = useSetVariant();

  useEffect(() => {
    setVariant(VARIANT.JACKS_OR_BETTER);
  }, [setVariant]);

  return <GameScreen />;
};

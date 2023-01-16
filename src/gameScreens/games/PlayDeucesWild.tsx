import { useEffect } from "react";
import { useSetVariant } from "../../redux/hooks";
import { VARIANT } from "../../types/variant";
import { GameScreen } from "./GameScreen";

export const PlayDeucesWild = () => {
  const setVariant = useSetVariant();

  useEffect(() => {
    setVariant(VARIANT.DEUCES_WILD);
  }, [setVariant]);

  return <GameScreen />;
};

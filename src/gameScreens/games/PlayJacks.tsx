import { useEffect } from "react";
import { useSetNHands, useSetVariant } from "../../redux/hooks";
import { N_HANDS, VARIANT } from "../../types/variant";
import { GameScreen, GameScreenProps } from "./GameScreen";

export const PlayJacks = (
  { nHands }: GameScreenProps = { nHands: N_HANDS.ONE }
) => {
  const setVariant = useSetVariant();
  const setNHands = useSetNHands();

  useEffect(() => {
    setVariant(VARIANT.JACKS_OR_BETTER);
    setNHands(nHands ?? N_HANDS.ONE);
  }, [nHands, setNHands, setVariant]);

  return <GameScreen />;
};

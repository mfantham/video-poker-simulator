import { useEffect } from "react";
import { useSetNHands, useSetVariant } from "../../redux/hooks";
import { VARIANT, N_HANDS } from "../../types/variant";
import { GameScreen, GameScreenProps } from "./GameScreen";

export const PlayDeucesWild = ({ nHands }: GameScreenProps) => {
  const setVariant = useSetVariant();
  const setNHands = useSetNHands();

  useEffect(() => {
    setVariant(VARIANT.DEUCES_WILD);
    setNHands(nHands ?? N_HANDS.ONE);
  }, [nHands, setNHands, setVariant]);

  return <GameScreen />;
};

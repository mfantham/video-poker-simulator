import {
  useShowAnalysis,
  useStage,
  useToggleShowAnalysis,
} from "../../redux/hooks";
import { Stages } from "../../redux/types";
import { MenuButton } from "./MenuButton";

export const ShowAnalysisButton = () => {
  const showAnalysis = useShowAnalysis();
  const toggleShowAnalysis = useToggleShowAnalysis();
  const stage = useStage();

  return (
    <MenuButton
      onClick={toggleShowAnalysis}
      lockedOn={showAnalysis}
      keyCode={"KeyA"}
      disabled={stage === Stages.PREGAME}
    >
      analysis
    </MenuButton>
  );
};

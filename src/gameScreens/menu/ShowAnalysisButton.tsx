import { useShowAnalysis, useToggleShowAnalysis } from "../../redux/hooks";
import { MenuButton } from "./MenuButton";

export const ShowAnalysisButton = () => {
  const showAnalysis = useShowAnalysis();
  const toggleShowAnalysis = useToggleShowAnalysis();

  return (
    <MenuButton onClick={toggleShowAnalysis} lockedOn={showAnalysis}>
      analysis
    </MenuButton>
  );
};

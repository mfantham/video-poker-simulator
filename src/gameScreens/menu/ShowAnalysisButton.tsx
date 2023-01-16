import { useShowAnalysis, useToggleShowAnalysis } from "../../redux/hooks";

export const ShowAnalysisButton = () => {
  const showAnalysis = useShowAnalysis();
  const toggleShowAnalysis = useToggleShowAnalysis();

  return (
    <button onClick={toggleShowAnalysis}>
      {showAnalysis ? "hide" : "show"} analysis
    </button>
  );
};

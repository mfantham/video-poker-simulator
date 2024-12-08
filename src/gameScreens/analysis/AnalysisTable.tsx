import styled from "styled-components";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { PrettyPrintAnalysis } from "./PrettyPrintAnalysis";
import {
  useCurrentAnalysis,
  useNHands,
  useToggleShowAnalysis,
} from "../../redux/hooks";
import { SortIndex } from "../../types/SortIndex";
import { handIdxToHand } from "../../utils/handIdxToHand";
import { N_HANDS } from "../../types/variant";

const AnalysisTimeHolder = styled.div`
  position: absolute;
  bottom: 0;
  backdrop-filter: blur(10px);
  width: 100%;
`;

const AnalysisTime = ({ showTime = false, analysisTime = 0 }) => {
  if (!showTime) return null;
  if (analysisTime === 0) {
    return <AnalysisTimeHolder>Analysing ...</AnalysisTimeHolder>;
  }
  return (
    <AnalysisTimeHolder>
      Analysis took {(analysisTime / 1000).toFixed(3)} s
    </AnalysisTimeHolder>
  );
};

export const AnalysisTable = ({
  showTime = false,
  handIdx,
  handSortOrder,
  abbreviatedHeadings,
}: {
  showTime?: boolean;
  handIdx: number;
  handSortOrder?: SortIndex;
  abbreviatedHeadings?: boolean;
}) => {
  const sortedHand = handIdxToHand(handIdx);
  const nHands = useNHands();

  const { holdsTable, analysisTime } = useCurrentAnalysis();

  const toggleShowAnalysis = useToggleShowAnalysis();

  if (nHands > N_HANDS.ONE) {
    return (
      <Dialog open={true} onClose={toggleShowAnalysis}>
        <DialogTitle>
          <IconButton
            onClick={toggleShowAnalysis}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              zIndex: 3,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <PrettyPrintAnalysis
          analysisTable={holdsTable}
          holdsOrder={handSortOrder}
          sortedHand={sortedHand}
          abbreviatedHeadings={abbreviatedHeadings}
        />
      </Dialog>
    );
  }

  return (
    <>
      <PrettyPrintAnalysis
        analysisTable={holdsTable}
        holdsOrder={handSortOrder}
        sortedHand={sortedHand}
      />
      <AnalysisTime showTime={showTime} analysisTime={analysisTime} />
    </>
  );
};

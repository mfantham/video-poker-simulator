import styled from "styled-components";
import { Tooltip } from "@mui/material";

import { HoldsTable } from "../../types/Hold";
import { intToHoldString } from "../../utils/intToHoldString";
import { SortIndex } from "../../types/SortIndex";
import { Hand } from "../../types/hand";
import { GHand } from "../../graphics/gHand";
import { HidePattern } from "../../types/HidePattern";
import { ReactNode } from "react";

const DEFAULT_HOLDS_LENGTH = 32;

const TableHolder = styled.div`
  overflow: auto;
  border-radius: 20px;
  margin: 0 auto;
`;

const TableHead = styled.thead`
  font-size: 24px;
  margin-bottom: 100px;
`;

const THStyled = styled.th`
  padding: 0 5px;
  position: sticky;
  top: 0; // Required for the stickiness
  backdrop-filter: blur(10px);
  z-index: 3;
  cursor: default;
`;

const TDStatistic = styled.td`
  padding: 0 5px;
`;

const TH = ({ title, children }: { title?: string; children?: ReactNode }) => {
  if (!title) {
    return <THStyled>{children}</THStyled>;
  }
  return (
    <Tooltip title={title}>
      <THStyled>{children}</THStyled>
    </Tooltip>
  );
};

const HoldsDisplay = ({
  holdPattern,
  sortedHand,
  holdsOrder,
}: {
  holdPattern: string;
  sortedHand?: Hand;
  holdsOrder?: SortIndex;
}) => {
  if (sortedHand && holdsOrder) {
    const orderedHand = holdsOrder.map((i) => sortedHand[i]) as Hand;
    const orderedHides = holdsOrder.map(
      (i) => holdPattern[i] !== "1"
    ) as HidePattern;
    return <GHand hand={orderedHand} hide={orderedHides} mini />;
  }
  if (sortedHand) {
    const hides = holdPattern.split("").map((v) => v !== "1") as HidePattern;
    return <GHand hand={sortedHand} hide={hides} mini />;
  }

  const orderedPattern =
    holdsOrder?.length === 5
      ? holdsOrder.map((i) => holdPattern[i]).join("")
      : holdPattern;
  return <span>holdPattern</span>;
};

const PrettyPrintAnalysisHeadings = ({
  abbreviatedHeadings,
}: {
  abbreviatedHeadings?: boolean;
}) => {
  if (abbreviatedHeadings) {
    return (
      <TableHead>
        <tr>
          <TH>Hold</TH>
          <TH title="Expected win (coins)">E(win)/$</TH>
          <TH title="Probability of win (%)">P(win)/%</TH>
          <TH title="Max possible win (coins)">M(win)/$</TH>
        </tr>
      </TableHead>
    );
  }

  return (
    <TableHead>
      <tr>
        <TH>Hold</TH>
        <TH>Expected win (coins)</TH>
        <TH>Chance of win %</TH>
        <TH>Max possible win</TH>
      </tr>
    </TableHead>
  );
};

export const PrettyPrintAnalysis = ({
  analysisTable,
  holdsOrder,
  sortedHand,
  abbreviatedHeadings,
}: {
  analysisTable: HoldsTable;
  holdsOrder?: SortIndex;
  sortedHand?: Hand;
  abbreviatedHeadings?: boolean;
}) => {
  let rows = new Array(DEFAULT_HOLDS_LENGTH).fill(0).map((_, idx) => (
    <tr key={idx}>
      <td>{intToHoldString(idx)}</td>
      <td>&nbsp;</td>
    </tr>
  ));

  if (analysisTable?.length > 0) {
    rows = analysisTable.map(([holdPattern, holdStats]) => {
      const statsColumns = Object.values(holdStats).map((v, i) => {
        if (i === 2) return <TDStatistic key={i}>{v.toFixed(0)}</TDStatistic>;
        return <TDStatistic key={i}>{v.toPrecision(5)}</TDStatistic>;
      });

      return (
        <tr key={holdPattern}>
          <td>
            <HoldsDisplay
              holdPattern={holdPattern}
              holdsOrder={holdsOrder}
              sortedHand={sortedHand}
            />
          </td>
          {statsColumns}
        </tr>
      );
    });
  }

  return (
    <TableHolder>
      <table>
        <PrettyPrintAnalysisHeadings
          abbreviatedHeadings={abbreviatedHeadings}
        />
        <tbody>{rows}</tbody>
      </table>
    </TableHolder>
  );
};

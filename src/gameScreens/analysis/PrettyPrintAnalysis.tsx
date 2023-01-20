import { HoldsTable } from "../../types/Hold";
import { intToHoldString } from "../../utils/intToHoldString";
import { SortIndex } from "../../types/SortIndex";
import { Hand } from "../../types/hand";
import { GHand } from "../../graphics/gHand";
import { HidePattern } from "../../types/HidePattern";

const DEFAULT_HOLDS_LENGTH = 32;

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
    console.log(sortedHand, holdsOrder);
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

export const PrettyPrintAnalysis = ({
  analysisTable,
  holdsOrder,
  sortedHand,
}: {
  analysisTable: HoldsTable;
  holdsOrder?: SortIndex;
  sortedHand?: Hand;
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
        if (i === 2) return <td key={i}>{v.toFixed(0)}</td>;
        return <td key={i}>{v.toPrecision(5)}</td>;
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
    <table>
      <thead>
        <tr>
          <th>Hold</th>
          <th>Expected win (coins)</th>
          <th>Chance of win %</th>
          <th>Max possible win</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

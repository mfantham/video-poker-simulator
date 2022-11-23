const SVG_STYLE = { width: "80vw", height: "45vh" };

export const HistoryGraph = ({ history }: { history: Array<number> }) => {
  let yMax = -Infinity;
  const d = history.reduce(
    (reducedString: string, coins: number, idx: number) => {
      if (coins > yMax) {
        yMax = coins;
      }
      return reducedString + `${idx},${-1 * coins} `;
    },
    "M"
  );

  return (
    <svg
      style={SVG_STYLE}
      viewBox={`0, ${-1 * yMax}, ${history.length}, ${yMax}`}
      preserveAspectRatio="none"
    >
      <path stroke={"white"} fill="none" d={d} />
      <rect
        x="0"
        y={-1 * yMax}
        width={history.length}
        height={yMax}
        fill="none"
        stroke="white"
      />
    </svg>
  );
};

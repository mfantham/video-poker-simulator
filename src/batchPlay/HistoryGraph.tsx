import { useWorker, WORKER_STATUS } from "@koale/useworker";
import { useEffect, useRef } from "react";

const SVG_STYLE = { width: "100%", height: "25vh" };

const testWorker = () => {
  console.log("en worker");
  return 1;
};

const makePath = (coinsHistory: Array<number>, expected: Array<number>) => {
  let yMax = -Infinity;
  const d = coinsHistory.reduce(
    (reducedString: string, coins: number, idx: number) => {
      if (coins > yMax) {
        yMax = coins;
      }
      return reducedString + `${idx},${-1 * coins} `;
    },
    "M"
  );

  const dExpected = expected.reduce(
    (reducedString: string, coins: number, idx: number) => {
      if (coins > yMax) {
        yMax = coins;
      }
      return reducedString + `${idx},${-1 * coins} `;
    },
    "M"
  );

  return {
    pathExpected: dExpected,
    pathCoins: d,
    yMax,
  };
};

export const HistoryGraph = ({
  coinsHistory,
  expected,
}: {
  coinsHistory: Array<number>;
  expected: Array<number>;
}) => {
  const [worker, { status: workerStatus }] = useWorker(makePath);
  const pathExpected = useRef("");
  const pathCoins = useRef("");
  const yMax = useRef(1000);
  const freshPage = useRef(true);
  const storedLength = useRef(-2);

  useEffect(() => {
    if (workerStatus === WORKER_STATUS.PENDING && storedLength.current === -2) {
      // This ugliness because react-dev calls useEffect twice with PENDING status
      storedLength.current = -1;
      return;
    }

    if (workerStatus !== WORKER_STATUS.RUNNING) {
      // Only run again if the worker has finished (and it's not first-page-load in dev-mode)
      if (storedLength.current !== coinsHistory.length) {
        worker(coinsHistory, expected).then((result) => {
          pathExpected.current = result.pathExpected;
          pathCoins.current = result.pathCoins;
          yMax.current = result.yMax;
          storedLength.current = coinsHistory.length;
        });
      }
    }
    freshPage.current = false;
  }, [coinsHistory, expected, worker, workerStatus]);

  const width = Math.max(coinsHistory.length, 200);
  const height = Math.max(yMax.current + 20, 1200);
  const color =
    (expected.at(-1) ?? 0) < (coinsHistory.at(-1) ?? 0) ? "green" : "red";

  return (
    <svg
      style={SVG_STYLE}
      viewBox={`0, ${-1 * height}, ${width}, ${height}`}
      preserveAspectRatio="none"
    >
      <path stroke={"white"} fill="none" d={pathExpected.current} />
      <path stroke={color} fill="none" d={pathCoins.current} />
      <rect
        x="0"
        y={-1 * height}
        width={width}
        height={height}
        fill="none"
        stroke="white"
      />
    </svg>
  );
};

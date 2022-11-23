import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { allPossibleHands } from "../strategy/allPossibleHands";
import { newDeck } from "../mechanics/deal";
import { GHand } from "../graphics/gHand";
import { Hand } from "../types/hand";
import { evaluateHand } from "../strategy/evaluateHand";
import { HoldsTable } from "../types/Hold";
import logo from "../logo.svg";
import { PrettyPrintAnalysis } from "../utils/PrettyPrintAnalysis";
import { runGpuAnalysis } from "../webgpu/setup";

export const HandExplorer = () => {
  const [displayedCombination, setDisplayedCombination] = useState(0);
  const allCombinations = useMemo(() => {
    return allPossibleHands();
  }, []);
  const sortedDeck = useMemo(newDeck, []);

  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState([] as HoldsTable);
  const [analysisTime, setAnalysisTime] = useState(0);

  const hand = useMemo(() => {
    const combinationNumbers = allCombinations[displayedCombination];
    const combinationHand = [
      sortedDeck[combinationNumbers[0]],
      sortedDeck[combinationNumbers[1]],
      sortedDeck[combinationNumbers[2]],
      sortedDeck[combinationNumbers[3]],
      sortedDeck[combinationNumbers[4]],
    ] as Hand;
    setAnalysis([]); // Analysis table not valid for this hand!
    setAnalysisTime(0);
    return combinationHand;
  }, [displayedCombination]);

  const numberOfHands = allCombinations.length;

  const runAnalysis = useCallback(async () => {
    setAnalysing(true);
    const tic = performance.now();
    // const analysisTable = await runGpuAnalysis();
    const analysisTable = await evaluateHand(hand);
    const toc = performance.now();
    setAnalysing(false);
    setAnalysisTime(toc - tic);
    setAnalysis(analysisTable);
  }, [hand]);

  return (
    <>
      Number of hands: {numberOfHands}
      <input
        type="number"
        min={0}
        max={numberOfHands - 1}
        value={displayedCombination}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setDisplayedCombination(Number(e.target.value))
        }
      />
      Hand {displayedCombination}: <GHand hand={hand} />
      <button onClick={runAnalysis}>Analyse hand</button>
      {analysisTime ? (
        <p>Analysis took {(analysisTime / 1000).toFixed(3)} s</p>
      ) : null}
      {analysing ? (
        <img src={logo} className="App-logo" alt="loading spinner" />
      ) : null}
      <PrettyPrintAnalysis analysisTable={analysis} />
    </>
  );
};

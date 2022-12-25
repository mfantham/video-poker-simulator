import { useCurrentHandIdx, useSetCurrentHand } from "../redux/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { handIdxToHand } from "../utils/handIdxToHand";
import { handToString } from "../utils/handToString";
import { stringToHand } from "../utils/stringToHand";

export const HandString = () => {
  const handIdx = useCurrentHandIdx();
  const setHand = useSetCurrentHand();
  const [string, setString] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const hand = handIdxToHand(handIdx);
    const handString = handToString(hand);
    setString(handString);
  }, [handIdx]);

  const isValid = (handString: string) => {
    if (handString.length !== 10) {
      return false;
    }
    const hand = handString.split("");
    for (let i = 0; i < hand.length; i += 2) {
      const card = hand[i] + hand[i + 1];
      if (!card.match(/^[2-9TJQKA][cdhs]$/i)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setInvalid(!isValid(string));
    if (isValid(string)) {
      const hand = stringToHand(string);
      setHand(hand);
    }
  }, [string]);

  const style = useMemo(() => {
    return invalid ? { color: "red", border: "1px solid red" } : {};
  }, [invalid]);

  return (
    <input
      type="text"
      value={string}
      onChange={(e) => setString(e.target.value)}
      style={style}
    />
  );
};

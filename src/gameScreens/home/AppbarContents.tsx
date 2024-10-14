import { useLocation } from "react-router-dom";

export const AppbarContents = () => {
  const { pathname } = useLocation();

  let gameName = "MF Video Poker";
  let nHandsString = "";

  if (pathname.includes("analysis")) {
    gameName = "Hand analyser";
  }
  if (pathname.includes("deuces")) {
    gameName = "Deuces Wild";
  }
  if (pathname.includes("jacks")) {
    gameName = "Jacks or Better";
  }
  if (pathname.includes("auto")) {
    gameName = "Auto Play!";
  }

  if (pathname.includes("triple")) {
    nHandsString = "Triple Play";
  }
  if (pathname.includes("five")) {
    nHandsString = "Five Play";
  }
  if (pathname.includes("ten")) {
    nHandsString = "Ten Play";
  }
  if (pathname.includes("hundred")) {
    nHandsString = "100 Play";
  }

  if (nHandsString) {
    return (
      <>
        {gameName} - {nHandsString}
      </>
    );
  }

  return <>{gameName}</>;
};

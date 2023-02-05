import { useLocation } from "react-router-dom";

export const AppbarContents = () => {
  const { pathname } = useLocation();

  if (pathname.includes("analysis")) {
    return <>Hand analyser</>;
  }
  if (pathname.includes("deuces")) {
    return <>Deuces Wild</>;
  }
  if (pathname.includes("jacks")) {
    return <>Jacks or Better</>;
  }
  if (pathname.includes("auto")) {
    return <>Auto Play!</>;
  }

  return <>MF Video Poker</>;
};

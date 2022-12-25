import { createBrowserRouter } from "react-router-dom";

import { Home } from "../gameScreens/Home";
import { HandExplorer } from "../gameScreens/HandExplorer";
import { BatchPlay } from "../batchPlay/BatchPlay";
import { PlayDeucesWild } from "../gameScreens/PlayDeucesWild";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/explore", element: <HandExplorer /> },
  { path: "/batch", element: <BatchPlay /> },
  { path: "/deuces", element: <PlayDeucesWild /> },
]);

import { useEffect } from "react";
import "./App.css";

import { fetchPaytable } from "./payoutCalculations/jacks-or-better/calculatePayout";
import { RouterProvider } from "react-router";
import { router } from "./routing/Router";

function App() {
  // Prefetch paytables
  useEffect(() => {
    fetchPaytable();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* @ts-expect-error */}
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;

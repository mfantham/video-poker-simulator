import { useEffect } from "react";
import "./App.css";

import { fetchPaytable } from "./payoutCalculations/jacks-or-better/calculatePayout";
import { Route, Routes } from "react-router-dom";
import { Home } from "./gameScreens/home/Home";
import { HandExplorer } from "./gameScreens/HandExplorer";

function App() {
  // Prefetch paytables
  useEffect(() => {
    fetchPaytable();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/analysis" element={<HandExplorer />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;

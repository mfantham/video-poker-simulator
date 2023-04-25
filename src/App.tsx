import { useEffect } from "react";
import "./App.css";

import { fetchPaytable } from "./payoutCalculations/jacks-or-better/calculatePayout";
import { Route, Routes } from "react-router-dom";
import { Home } from "./gameScreens/home/Home";
import { SynthEngine } from "./audio/SynthEngine";

function App() {
  // Prefetch paytables
  useEffect(() => {
    fetchPaytable();
  }, []);

  return (
    <div className="App">
      <SynthEngine />
      <div className="App-holder">
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

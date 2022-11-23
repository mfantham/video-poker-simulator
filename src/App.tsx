import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { DumbLuck } from "./gameScreens/DumbLuck";
import { BatchPlay } from "./batchPlay/BatchPlay";
import { HandExplorer } from "./gameScreens/HandExplorer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<DumbLuck />*/}
        {/*<BatchPlay />*/}
        <HandExplorer />
      </header>
    </div>
  );
}

export default App;

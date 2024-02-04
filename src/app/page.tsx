import React from "react";

import Home from "@/pages/Home";
import { MarketProvider } from "@/context/market";

const App = () => {
  return (
    <div className="app">
      <MarketProvider>
        <Home />
      </MarketProvider>
    </div>
  );
};

export default App;

import { render, screen } from "@testing-library/react";

import { MarketProvider } from "@/context/market";

import Home from "../Home";

describe("Home", () => {
  it("renders home merket components", () => {
    render(
      <MarketProvider>
        <Home />
      </MarketProvider>
    );

    const exchanges = screen.getByTestId("exchanges");
    const indices = screen.getByTestId("indices");
    const currencies = screen.getByTestId("currencies");
    const marketHolidays = screen.getByTestId("market-holidays");

    expect(exchanges).toBeInTheDocument();
    expect(indices).toBeInTheDocument();
    expect(currencies).toBeInTheDocument();
    expect(marketHolidays).toBeInTheDocument();
  });
});

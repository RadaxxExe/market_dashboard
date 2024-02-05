import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";

import { polyAPI } from "../../../context/market";
import StockEvolution from "../StockEvolution";
import TickerFinancial from "../TickerFinancial";

// Mocking the API module
jest.mock("../../../context/market", () => ({
  useMarketContext: jest.fn(() => ({
    currentTicker: "AAPL",
  })),
}));

describe("StockEvolution component tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("renders 'NO TICKER PERFORMANCE DATA' when tickerPerformance is not available", () => {
    render(<StockEvolution />);
    expect(screen.getByText("NO TICKER PERFORMANCE DATA")).toBeInTheDocument();
  });

  test("renders 'NO TICKER FINANCIAL DATA' when tickerPerformance is not available", () => {
    render(<TickerFinancial />);
    expect(screen.getByText("NO TICKER FINANCIAL DATA")).toBeInTheDocument();
    expect(screen.getByText("Refresh")).toBeInTheDocument();
  });
});

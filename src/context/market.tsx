"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  IMarketStatus,
  ITickerDetails,
  restClient,
} from "@polygon.io/client-js";

export const polyAPI = restClient(process.env.NEXT_PUBLIC_POLY_API_KEY);

interface MarketContextProps {
  currentTicker: string;
  globalMarket: IMarketStatus;
  tickerDetails: ITickerDetails;
  setGlobalMarket: (newGlobalMarket: IMarketStatus) => void;
  setTickerDetails: (newTickerDetail: ITickerDetails) => void;
  setCurrentTicker: (newTicker: string) => void;
}

const MarketContext = createContext<MarketContextProps | undefined>(undefined);

interface MarketProviderProps {
  children: ReactNode;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children }) => {
  const [currentTicker, setNewCurrentTicker] = useState<string>("");
  const [globalMarket, setNewGlobalMarket] = useState<IMarketStatus>({});
  const [tickerDetails, setNewTickerDetails] = useState<ITickerDetails>({});

  const setCurrentTicker = (newTicker: string) => {
    setNewCurrentTicker(newTicker);
  };

  const setGlobalMarket = (newGlobalMarket: IMarketStatus) => {
    setNewGlobalMarket(newGlobalMarket);
  };

  const setTickerDetails = (newTickerDetail: ITickerDetails) => {
    setNewTickerDetails(newTickerDetail);
  };

  return (
    <MarketContext.Provider
      value={{
        currentTicker,
        globalMarket,
        tickerDetails,
        setCurrentTicker,
        setGlobalMarket,
        setTickerDetails,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketContext = (): MarketContextProps => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useTicker must be used within a MarketProvider");
  }
  return context;
};

import { useEffect, useState } from "react";
import { IStockFinancialResults } from "@polygon.io/client-js";

import { polyAPI, useMarketContext } from "@/context/market";
import { BarChart, Card, Title } from "@tremor/react";

const TickerFinancial = () => {
  const { currentTicker } = useMarketContext();
  const [tickerFinancial, setTickerFinancial] =
    useState<IStockFinancialResults>({});

  // const formatPolygonData = (polygonData: IStockFinancialResults): FormattedData => {
  //     if (!polygonData || !polygonData.results) {
  //       return { name: "", data: [] };
  //     }

  //     return {
  //       name: polygonData.ticker ?? "",
  //       data: polygonData.results.map((result) => ({
  //         time: timestampToUSDate(result.t) ?? 0,
  //         close: result.c ?? 0,
  //         high: result.h ?? 0,
  //         low: result.l ?? 0,
  //         transactions: result.n ?? 0,
  //         open: result.o ?? 0,
  //         volume: result.v ?? 0,
  //         vwap: result.vw ?? 0,
  //       })),
  //     };
  //   };

  const fetchTickerFinance = async () => {
    try {
      const data = await polyAPI.reference.stockFinancials({
        ticker: currentTicker,
      });
      if (data) {
        setTickerFinancial(data);
      } else {
        console.error("ERROR - Ticker data not available");
      }
    } catch (error) {
      return console.error("ERROR - Fail to fetch ticker aggregation:", error);
    }
  };

  useEffect(() => {
    if (currentTicker) {
      fetchTickerFinance();
    }
  }, [currentTicker]);

  if (!tickerFinancial.results) {
    return <Card>NO TICKER FINANCIAL DATA</Card>;
  }

  return (
    <Card>
      <Title>{currentTicker} - Financial Data</Title>
      <BarChart
        className="mt-6"
        data={tickerFinancial.results}
        index="name"
        categories={[
          "cash_flow_statement",
          "Balance",
          "Group C",
          "Group D",
          "Group E",
          "Group F",
        ]}
        colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
        yAxisWidth={48}
      />
    </Card>
  );
};

export default TickerFinancial;

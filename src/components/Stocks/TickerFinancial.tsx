import { useEffect, useState } from "react";
import { IStockFinancialResults } from "@polygon.io/client-js";
import { BarChart, Button, Card, Flex, Title } from "@tremor/react";
import { RefreshIcon } from "@heroicons/react/solid";

import { TickerFinancialData } from "@/context/market.type";
import { polyAPI, useMarketContext } from "@/context/market";

const TickerFinancial = () => {
  const { currentTicker } = useMarketContext();
  const [tickerFinancial, setTickerFinancial] = useState<TickerFinancialData>();

  const formatPolygonData = (
    polygonData: IStockFinancialResults
  ): TickerFinancialData => {
    if (!polygonData || !polygonData.results) {
      return { data: [] };
    }

    // Format data for the BarChart - In a production environement
    // it would be necessary to check with the product team what data is relevant to display.
    return {
      data: polygonData.results.map((result) => ({
        company_name: result.company_name ?? "",
        fiscal_year: result.fiscal_year ?? "",
        fiscal_period: `${result.fiscal_year} - ${result.fiscal_period}` ?? "",
        assets: result.financials.balance_sheet?.assets.value ?? 0,
        equity: result.financials.balance_sheet?.equity.value ?? 0,
        net_cash_flow:
          result.financials.cash_flow_statement?.net_cash_flow.value ?? 0,
        comprehensive_income:
          result.financials.comprehensive_income?.comprehensive_income_loss
            .value ?? 0,
        gross_profit:
          result.financials.income_statement?.gross_profit.value ?? 0,
        net_income_loss:
          result.financials.income_statement?.net_income_loss.value ?? 0,
      })),
    };
  };

  const fetchTickerFinance = async () => {
    try {
      const data = await polyAPI.reference.stockFinancials({
        ticker: currentTicker,
        timeframe: "quarterly",
      });
      if (data) {
        const formattedData = formatPolygonData(data);
        setTickerFinancial(formattedData);
      } else {
        console.error("ERROR - Ticker data not available");
      }
    } catch (error) {
      return console.error(
        "ERROR - Fail to fetch ticker financial data:",
        error
      );
    }
  };

  useEffect(() => {
    if (currentTicker) {
      fetchTickerFinance();
    }
  }, [currentTicker]);

  const valueFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  if (!tickerFinancial) {
    return (
      <Card>
        <Flex>
          NO TICKER FINANCIAL DATA
          <Button icon={RefreshIcon} onClick={() => fetchTickerFinance()}>
            Refresh
          </Button>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="mt-5">
      <Title>{currentTicker} - Financial Data</Title>
      <BarChart
        className="mt-6"
        data={tickerFinancial.data}
        index="fiscal_period"
        categories={[
          "assets",
          "equity",
          "net_cash_flow",
          "comprehensive_income",
          "gross_profit",
          "net_income_loss",
        ]}
        colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
        valueFormatter={valueFormatter}
        yAxisWidth={48}
      />
    </Card>
  );
};

export default TickerFinancial;

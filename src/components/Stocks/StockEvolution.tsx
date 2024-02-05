import { useEffect, useState } from "react";
import {
  AreaChart,
  Card,
  Color,
  DateRangePicker,
  DateRangePickerValue,
  Flex,
  Grid,
  Tab,
  TabGroup,
  TabList,
  Text,
  Title,
} from "@tremor/react";
import { IAggs } from "@polygon.io/client-js";

import { formatDateToUSFormat } from "@/utils/formatDateToUSFormat";

import { polyAPI, useMarketContext } from "@/context/market";

interface FormattedData {
  name: string;
  data: {
    time: string;
    close: number;
    high: number;
    low: number;
    transactions: number;
    open: number;
    volume: number;
    vwap: number;
  }[];
}

const Kpis = {
  HighLow: ["high", "low"],
  OpenClose: ["open", "close"],
  Volume: ["volume"],
};

const kpiList = [Kpis.HighLow, Kpis.OpenClose, Kpis.Volume];

const StockEvolution = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { currentTicker } = useMarketContext();
  const [tickerPerformance, setTickerPerformance] = useState<FormattedData>();
  const [timeRange, setTimeRange] = useState<DateRangePickerValue>({
    from: new Date("2023-01-01"),
    to: new Date("2023-02-01"),
  });

  const selectedKpi = kpiList[selectedIndex];

  const timestampToUSDate = (timestamp?: number) => {
    if (!timestamp) return "";

    const dateObject = new Date(timestamp);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    const usDateFormat = `${year}-${month}-${day}`;
    return usDateFormat;
  };

  const formatPolygonData = (polygonData: IAggs | undefined): FormattedData => {
    if (!polygonData || !polygonData.results) {
      return { name: "", data: [] };
    }

    return {
      name: polygonData.ticker ?? "",
      data: polygonData.results.map((result) => ({
        time: timestampToUSDate(result.t) ?? 0,
        close: result.c ?? 0,
        high: result.h ?? 0,
        low: result.l ?? 0,
        transactions: result.n ?? 0,
        open: result.o ?? 0,
        volume: result.v ?? 0,
        vwap: result.vw ?? 0,
      })),
    };
  };

  const fetchTickerPerformance = async () => {
    try {
      const data = await polyAPI.stocks.aggregates(
        currentTicker,
        1,
        "day",
        formatDateToUSFormat(timeRange.from),
        formatDateToUSFormat(timeRange.to)
      );
      if (data) {
        const formattedData = formatPolygonData(data);
        setTickerPerformance(formattedData);
      } else {
        console.error("ERROR - Ticker data not available");
      }
    } catch (error) {
      return console.error("ERROR - Fail to fetch ticker aggregation:", error);
    }
  };

  useEffect(() => {
    if (currentTicker) {
      fetchTickerPerformance();
    }
  }, [currentTicker, timeRange]);

  const areaChartArgs = {
    className: "h-72 mt-4",
    data: tickerPerformance?.data || [],
    index: "time",
    categories: selectedKpi,
    colors: ["blue"] as Color[],
    showLegend: false,
    yAxisWidth: 60,
  };

  if (!tickerPerformance) {
    return <Card className="mt-5">NO TICKER PERFORMANCE DATA</Card>;
  }

  return (
    <Grid numItemsMd={1} numItemsLg={1} className="gap-6 mt-6">
      <Card>
        <div className="md:flex justify-between">
          <div>
            <Flex
              className="space-x-0.5"
              justifyContent="start"
              alignItems="center"
            >
              <Title>{currentTicker} - Stock evolution</Title>
            </Flex>
            <Text>Aggregate bars for a stock over a given date range</Text>
            <DateRangePicker
              className="max-w-sm mx-auto my-5"
              value={timeRange}
              onValueChange={setTimeRange}
              enableSelect={true}
            />
          </div>
          <div>
            <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
              <TabList color="gray" variant="solid">
                <Tab>High/Low</Tab>
                <Tab>Open/Close</Tab>
                <Tab>Volume</Tab>
              </TabList>
            </TabGroup>
          </div>
        </div>

        <div className="mt-8 hidden sm:block">
          <AreaChart {...areaChartArgs} />
        </div>
      </Card>
    </Grid>
  );
};

export default StockEvolution;

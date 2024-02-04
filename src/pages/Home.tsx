"use client";

import {
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";

import TickerDetails from "@/components/TickerDetails";
import MarketStatus from "@/components/MarketStatus";
import IndicesStatus from "@/components/IndicesStatus";
import StockEvolution from "@/components/StockEvolution";

const Home = () => {
  return (
    <main className="p-12">
      <Title>Gravity - Market Dashboard</Title>
      <Text>US stock price trends using the Polygon.io API</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Market Overview</Tab>
          <Tab>Detail</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MarketStatus />
            <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
              <IndicesStatus />
              <TickerDetails />
            </Grid>

            <StockEvolution />
          </TabPanel>

          <TabPanel>
            <div className="mt-6"></div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};

export default Home;

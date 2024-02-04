"use client";

import {
  Card,
  Flex,
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
} from "@tremor/react";
import Image from "next/image";

import TickerDetails from "@/components/TickerDetails";
import MarketStatus from "@/components/MarketStatus";
import IndicesStatus from "@/components/IndicesStatus";
import StockEvolution from "@/components/StockEvolution";
import StockSearch from "@/components/StockSearch";

import Logo from "../../public/assets/logo.png";
import CurrenciesStatus from "@/components/CurrenciesStatus";

const Home = () => {
  return (
    <main className="p-12">
      <Flex>
        <div className="flex flex-row items-center">
          <Image
            src={Logo}
            width={75}
            height={75}
            alt="logo"
            className="mr-2"
          />
          <Title>Gravity - Market Dashboard</Title>
        </div>

        <Text>US stock price trends using the Polygon.io API</Text>
      </Flex>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Market Overview</Tab>
          <Tab>Stocks</Tab>
          <Tab>Options</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MarketStatus />
            <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mt-6">
              <IndicesStatus />
              <CurrenciesStatus />
            </Grid>
          </TabPanel>

          <TabPanel>
            <div className="mt-6">
              <StockSearch />
              <TickerDetails />
              <StockEvolution />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
};

export default Home;

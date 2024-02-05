import { useEffect } from "react";
import { Card, Grid, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";
import { apiCallWithRetry } from "@/utils/apiCallWithRetry";

import { polyAPI, useMarketContext } from "@/context/market";

const MarketStatus = () => {
  const { globalMarket, setGlobalMarket } = useMarketContext();

  useEffect(() => {
    apiCallWithRetry(async () => {
      try {
        const data = await polyAPI.reference.marketStatus();
        return setGlobalMarket(data);
      } catch (error) {
        return console.error("ERROR - Fail to fetch market Status:", error);
      }
    });
  }, []);

  if (!globalMarket.exchanges) {
    return <Card data-testid="exchanges">NO EXCHANGES DATA</Card>;
  }

  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
      <Card>
        <div className="h-15">
          <Text>NASDQ</Text>
          {getColorBasedOnStatus(globalMarket.exchanges.nasdaq)}
        </div>
      </Card>
      <Card>
        <div className="h-15">
          <Text>NYSE</Text>
          {getColorBasedOnStatus(globalMarket.exchanges.nyse)}
        </div>
      </Card>
      <Card>
        <div className="h-15">
          <Text>OTC</Text>
          {getColorBasedOnStatus(globalMarket.exchanges.otc)}
        </div>
      </Card>
    </Grid>
  );
};

export default MarketStatus;
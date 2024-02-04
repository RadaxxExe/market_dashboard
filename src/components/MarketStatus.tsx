import { useContext, useEffect } from "react";
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
        return console.log("ERROR - Fail to fetch market Status:", error);
      }
    });
  }, []);

  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
      {globalMarket.exchanges ? (
        <>
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
        </>
      ) : (
        <Card>NO EXCHANGES DATA</Card>
      )}
    </Grid>
  );
};

export default MarketStatus;

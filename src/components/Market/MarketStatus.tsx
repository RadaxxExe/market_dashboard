import { useEffect } from "react";
import { Button, Card, Grid, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";

import { useMarketContext } from "@/context/market";
import { fetchPolygon } from "@/utils/fetchPolygon";
import { RefreshIcon } from "@heroicons/react/solid";

const MarketStatus = () => {
  const { globalMarket, setGlobalMarket } = useMarketContext();

  const fetchMarketStatus = () => {
    fetchPolygon(`/v1/marketstatus/now`)
      .then((data) => {
        if (data) {
          setGlobalMarket(data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMarketStatus();
  }, []);

  if (!globalMarket.exchanges) {
    return (
      <Card data-testid="exchanges">
        NO EXCHANGES DATA
        <br />
        <Button
          icon={RefreshIcon}
          onClick={() => fetchMarketStatus()}
          className="mt-2"
        >
          Refresh
        </Button>
      </Card>
    );
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

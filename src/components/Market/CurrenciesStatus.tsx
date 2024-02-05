import { Card, Flex, Metric, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";

import { useMarketContext } from "@/context/market";

const CurrenciesStatus = () => {
  const { globalMarket } = useMarketContext();

  if (!globalMarket.currencies) {
    return <Card data-testid="currencies">NO CURRENCY DATA</Card>;
  }

  return (
    <Card>
      <div className="h-90">
        <Text>Currencies</Text>
        <Flex>
          <div>
            {Object.keys(globalMarket.currencies).map((currencyKey) => (
              <Metric key={currencyKey}>{currencyKey.toUpperCase()}</Metric>
            ))}
          </div>
          <div>
            {Object.values(globalMarket.currencies).map(
              (currencyValue, index) => (
                <div key={index}>{getColorBasedOnStatus(currencyValue)}</div>
              )
            )}
          </div>
        </Flex>
      </div>
    </Card>
  );
};

export default CurrenciesStatus;

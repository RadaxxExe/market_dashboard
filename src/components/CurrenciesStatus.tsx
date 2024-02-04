import { Card, Flex, Metric, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";

import { useMarketContext } from "@/context/market";

const CurrenciesStatus = () => {
  const { globalMarket } = useMarketContext();

  return (
    <>
      {globalMarket.currencies ? (
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
                    <div key={index}>
                      {getColorBasedOnStatus(currencyValue)}
                    </div>
                  )
                )}
              </div>
            </Flex>
          </div>
        </Card>
      ) : (
        <Card>NO CURRENCY DATA</Card>
      )}
    </>
  );
};

export default CurrenciesStatus;

import { Card, Flex, Metric, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";

import { useMarketContext } from "@/context/market";

const IndicesStatus = () => {
  const { globalMarket } = useMarketContext();

  if (!globalMarket.indicesGroups) {
    return <Card data-testid="indices">NO INDICES DATA</Card>;
  }

  return (
    <Card>
      <div className="h-90">
        <Text>Indices</Text>
        <Flex>
          <div>
            {Object.keys(globalMarket.indicesGroups).map((indiceKey) => (
              <Metric key={indiceKey}>
                {indiceKey.toUpperCase().split("_").join(" ")}
              </Metric>
            ))}
          </div>
          <div>
            {Object.values(globalMarket.indicesGroups).map(
              (indiceValue, index) => (
                <div key={index}>{getColorBasedOnStatus(indiceValue)}</div>
              )
            )}
          </div>
        </Flex>
      </div>
    </Card>
  );
};

export default IndicesStatus;

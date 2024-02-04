import { Card, Flex, Metric, Text } from "@tremor/react";

import { getColorBasedOnStatus } from "@/utils/getColorBasedOnStatus";

import { useMarketContext } from "@/context/market";

const IndicesStatus = () => {
  const { globalMarket } = useMarketContext();

  return (
    <>
      {globalMarket.indicesGroups ? (
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
                {Object.values(globalMarket.indicesGroups).map((indiceValue) =>
                  getColorBasedOnStatus(indiceValue)
                )}
              </div>
            </Flex>
          </div>
        </Card>
      ) : (
        <Card>NO EXCHANGES DATA</Card>
      )}
    </>
  );
};

export default IndicesStatus;

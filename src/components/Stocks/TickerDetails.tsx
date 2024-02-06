import { useEffect, useState } from "react";
import { Card, Flex, Subtitle, Title } from "@tremor/react";
import _debounce from "lodash/debounce";

import { numberFormatter } from "@/utils/numberFormatter";
import { useMarketContext } from "@/context/market";
import { fetchPolygon } from "@/utils/fetchPolygon";

const TickerDetails = () => {
  const [isTickerFound, setIsTickerFound] = useState(true);
  const { currentTicker, tickerDetails, setTickerDetails } = useMarketContext();

  const fetchTickerDetails = (ticker: string) => {
    setIsTickerFound(false);

    fetchPolygon(`/v3/reference/tickers/${ticker}`)
      .then((data) => {
        if (data) {
          setTickerDetails(data);
          setIsTickerFound(true);
        } else {
          setIsTickerFound(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const debouncedFetchTickerDetails = _debounce(fetchTickerDetails, 1000);

  useEffect(() => {
    if (currentTicker) {
      debouncedFetchTickerDetails(currentTicker);
    }

    return () => debouncedFetchTickerDetails.cancel();
  }, [currentTicker]);

  if (!tickerDetails.results) {
    return <Card>NO TICKER DETAIL DATA</Card>;
  }

  const { name, description, homepage_url, branding, market_cap } =
    tickerDetails.results;

  return (
    <Card>
      <div className="h-90">
        {currentTicker === "" && (
          <Title className="mb-5">
            Search for a specific ticker using the search bar to obtain
            information on the company that owns the stock.
          </Title>
        )}
        {!isTickerFound && (
          <Title>
            Sorry we didn&apos;t find any ticker with the name &quot;
            {currentTicker}&quot;
          </Title>
        )}

        {isTickerFound ? (
          <>
            <Flex>
              <img
                src={`${branding?.logo_url}?apiKey=${process.env.NEXT_PUBLIC_POLY_API_KEY}`}
                alt="branding-icon"
                width={75}
                height={75}
              />
              <span>{name}</span>
            </Flex>
            <br />
            <Subtitle>{description}</Subtitle>
            <br />
            <span>{`Market Cap: ${numberFormatter(market_cap)}`}</span>
            <Flex>
              <span>
                <a href={homepage_url} />
                {homepage_url}
              </span>
            </Flex>
          </>
        ) : null}
      </div>
    </Card>
  );
};

export default TickerDetails;

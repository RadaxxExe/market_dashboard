import { useEffect, useState } from "react";
import { RefreshIcon, SearchIcon } from "@heroicons/react/solid";
import { Button, Card, Flex, Subtitle, Title } from "@tremor/react";
import _debounce from "lodash/debounce";
import Image from "next/image";

import { numberFormatter } from "@/utils/numberFormatter";
import { polyAPI, useMarketContext } from "@/context/market";
import { MutatingDots } from "react-loader-spinner";

const TickerDetails = () => {
  const [isTickerFound, setIsTickerFound] = useState(true);
  const [isTooManyRequest, setIsTooManyRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentTicker, tickerDetails, setTickerDetails } = useMarketContext();

  const fetchTickerDetails = async (ticker: string) => {
    console.log("FETCH TICKER DETAIL");

    setIsTickerFound(false);
    setIsTooManyRequest(false);
    setIsLoading(true);

    try {
      const data = await polyAPI.reference.tickerDetails(ticker);
      setTickerDetails(data);
      setIsTickerFound(true);
      setIsLoading(false);
    } catch (error: any) {
      console.log("error", error);
      if (error.response) {
        console.log(error.response);
        if (error.response.status === 429) {
          setIsTooManyRequest(true);
          setIsLoading(false);
          console.error("ERROR - Too many request (429)");
        } else if (error.response.status === 404) {
          setIsTickerFound(false);
          setIsLoading(false);
          console.error("ERROR - Ticker details not found (404)");
        }
      } else {
        console.error("ERROR - Fail to fetch ticker details:", error);
        throw error;
      }
    }
  };

  const debouncedFetchTickerDetails = _debounce(fetchTickerDetails, 1000);

  useEffect(() => {
    if (currentTicker) {
      debouncedFetchTickerDetails(currentTicker);
    }

    return () => debouncedFetchTickerDetails.cancel();
  }, [currentTicker]);

  if (isLoading) {
    return (
      <Card>
        <div className="h-90 place-items-center">
          <MutatingDots
            visible={true}
            height="150"
            width="150"
            ariaLabel="mutating-dots-loading"
            secondaryColor="#4CAF50"
            color="#e15b64"
          />
        </div>
      </Card>
    );
  }

  // Might be interesting to add Loader
  return (
    <Card>
      <div className="h-90">
        {currentTicker === "" && (
          <Title>
            Search for a specific ticker using the search bar to obtain
            information on the company that owns the stock.
          </Title>
        )}
        {isTooManyRequest && (
          <Flex>
            <Title>
              There seems to be too many request, please wait a bit before
              retrying
            </Title>
            <Button
              icon={RefreshIcon}
              onClick={() => debouncedFetchTickerDetails(currentTicker)}
            >
              Refresh data
            </Button>
          </Flex>
        )}
        {/* TODO: UI glitch when changing ticker */}
        {!isTickerFound && (
          <Title>
            Sorry we didn&apos;t find any ticker with the name &quot;
            {currentTicker}&quot;
          </Title>
        )}

        {tickerDetails.results && isTickerFound && !isTooManyRequest ? (
          <>
            <Flex>
              <img
                src={tickerDetails.results.branding?.logo_url}
                alt="branding-icon"
              />
              <span>{tickerDetails.results.name}</span>
            </Flex>
            <br />
            <Subtitle>{tickerDetails.results.description}</Subtitle>
            <br />
            <span>
              {`Market Cap: ${numberFormatter(
                tickerDetails.results.market_cap
              )}`}
            </span>
            <Flex>
              <span>
                <a href={tickerDetails.results.homepage_url} />
                {tickerDetails.results.homepage_url}
              </span>
            </Flex>
          </>
        ) : null}
      </div>
    </Card>
  );
};

export default TickerDetails;

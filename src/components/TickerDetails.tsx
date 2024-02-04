import { useEffect, useState } from "react";
import { RefreshIcon, SearchIcon } from "@heroicons/react/solid";
import { Button, Card, Flex, Subtitle, Text, TextInput } from "@tremor/react";
import _debounce from "lodash/debounce";
import Image from "next/image";

import { numberFormatter } from "@/utils/numberFormatter";
import { polyAPI, useMarketContext } from "@/context/market";

const TickerDetails = () => {
  const [isTickerFound, setIsTickerFound] = useState(true);
  const [isTooManyRequest, setIsTooManyRequest] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const { currentTicker, tickerDetails, setTicker, setTickerDetails } =
    useMarketContext();

  const fetchTickerDetails = async (ticker: string) => {
    console.log("FETCH TICKER DETAIL");

    setIsTooManyRequest(false);
    try {
      const data = await polyAPI.reference.tickerDetails(ticker);
      setTickerDetails(data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setIsTickerFound(false);
        console.error("ERROR - Ticker details not found (404)");
      }
      if (error.response && error.response.status === 429) {
        setIsTooManyRequest(true);
        console.error("ERROR - Too many request (429)");
      } else {
        console.error("ERROR - Fail to fetch ticker details:", error);
        throw error; // Propagate the error to maintain the promise chain
      }
    }
  };

  const debouncedFetchTickerDetails = _debounce(fetchTickerDetails, 1000);

  useEffect(() => {
    debouncedFetchTickerDetails(userSearch);

    return () => debouncedFetchTickerDetails.cancel();
  }, [currentTicker]);

  console.log("tickerDetails", tickerDetails);

  return (
    <Card>
      <div className="h-90">
        <Flex alignItems="center" className="mb-5">
          <TextInput
            value={userSearch}
            icon={SearchIcon}
            onChange={(event) => setUserSearch(event.target.value)}
            placeholder="Search..."
            className="mr-2"
          />
          {/* Use search button to decrease 429 error */}
          <Button
            icon={SearchIcon}
            variant="secondary"
            onClick={() => setTicker(userSearch)}
          >
            Search
          </Button>
        </Flex>

        {!isTickerFound ? (
          <Text>
            Sorry we didn&apos;t find any ticker with the name &quot;
            {currentTicker}&quot;
          </Text>
        ) : null}
        {isTooManyRequest ? (
          <Flex>
            <Text>
              There seems to be too many request, please wait a bit before
              retrying
            </Text>
            <Button
              icon={RefreshIcon}
              onClick={() => debouncedFetchTickerDetails(currentTicker)}
            >
              Refresh data
            </Button>
          </Flex>
        ) : null}
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

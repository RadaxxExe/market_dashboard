import { useEffect, useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import {
  TextInput,
  List,
  ListItem,
  Button,
  Flex,
  Card,
  Text,
} from "@tremor/react";

import { polyAPI, useMarketContext } from "@/context/market";
import { ITickers } from "@polygon.io/client-js";
import { debounce } from "lodash";

const MAX_SEARCH_RESULT = 10;

const StockSearch = () => {
  const { currentTicker, setCurrentTicker } = useMarketContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isTooManyRequest, setIsTooManyRequest] = useState(false);
  const [searchResults, setSearchResults] = useState<ITickers>();

  const debouncedFetchStocks = debounce(async (term) => {
    try {
      const data = await polyAPI.reference.tickers({
        search: term,
      });

      if (data) {
        setSearchResults(data);
      } else {
        console.error("ERROR - Ticker data not available");
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.status);
        if (error.response.status === 429) {
          setIsTooManyRequest(true);
          console.error("ERROR - Too many request (429)");
        }
      } else {
        console.error("ERROR - Fail to fetch ticker search:", error);
        throw error;
      }
    }
  }, 500);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      debouncedFetchStocks(searchTerm);
    } else {
      setSearchResults(undefined);
    }
  }, [searchTerm]);

  const handleSelectStock = (selectedStock: any) => {
    setSearchTerm(selectedStock.ticker);
    setSearchResults(undefined);
  };

  return (
    <Flex alignItems="center" className="mb-5 mt-5">
      {isTooManyRequest && (
        <Text>
          There&apos;s seems to be too many request, wait a bit before searching
          agin.
        </Text>
      )}
      <TextInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="mr-5"
      />
      {/* Use search button to decrease 429 error */}
      <Button
        icon={SearchIcon}
        variant="secondary"
        onClick={() => setCurrentTicker(searchTerm)}
      >
        Search
      </Button>

      {searchResults?.results ? (
        <Card
          className="px-10 z-10"
          style={{
            position: "absolute",
            top: "245px",
            maxWidth: "600px",
          }}
        >
          <List>
            {searchResults.results.slice(0, MAX_SEARCH_RESULT).map((stock) => (
              <ListItem
                key={stock.ticker}
                onClick={() => handleSelectStock(stock)}
                className="text-white"
              >
                {stock.name} ({stock.ticker})
              </ListItem>
            ))}
          </List>
        </Card>
      ) : null}
    </Flex>
  );
};

export default StockSearch;

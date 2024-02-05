import { useEffect, useState } from "react";
import { BanIcon, CheckIcon, SearchIcon } from "@heroicons/react/solid";
import { TextInput, List, ListItem, Button, Flex, Card } from "@tremor/react";

import { polyAPI, useMarketContext } from "@/context/market";
import { ITickers } from "@polygon.io/client-js";
import { debounce } from "lodash";

const MAX_SEARCH_RESULT = 10;

const StockSearch = () => {
  const { setCurrentTicker } = useMarketContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAutoCompleteActivated, setIsAutoCompleteActivated] = useState(false);
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
      } else {
        console.error("ERROR - Fail to fetch ticker search:", error);
        throw error;
      }
    }
  }, 500);

  useEffect(() => {
    if (searchTerm.trim() !== "" && isAutoCompleteActivated) {
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
      <TextInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="mr-5"
      />
      {/* Add a button to disable the autocomplete (429) */}
      <Button
        className="mr-2"
        color={isAutoCompleteActivated ? "green" : "red"}
        icon={isAutoCompleteActivated ? CheckIcon : BanIcon}
        variant="secondary"
        onClick={() => setIsAutoCompleteActivated(!isAutoCompleteActivated)}
      >
        AC
      </Button>
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
            top: "250px",
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

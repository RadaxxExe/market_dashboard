import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { IMarketHoliday } from "@polygon.io/client-js";

import { fetchPolygon } from "@/utils/fetchPolygon";

const ITEMS_PER_PAGE = 10;

const MarketHoliday = () => {
  const [marketHolidays, setMarketHolidays] = useState<IMarketHoliday[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMarketHolidays = () => {
      fetchPolygon(`/v1/marketstatus/upcoming`)
        .then((data) => {
          if (data) {
            setMarketHolidays(data);
          }
        })
        .catch((err) => console.error(err));
    };

    fetchMarketHolidays();
  }, []);

  // Change the color of the text based on the difference in day between the current date and the upcoming market holiday date
  const dateComparison = (date?: string) => {
    if (!date) {
      return undefined;
    }

    const currentDate = new Date();
    const inputDate = new Date(date);

    const differenceInDays = Math.floor(
      (inputDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (differenceInDays >= 0 && differenceInDays < 60) {
      return <span className="text-red-500">{differenceInDays}</span>;
    } else if (differenceInDays >= 60 && differenceInDays < 90) {
      return <span className="text-orange-500">{differenceInDays}</span>;
    } else {
      return <span className="text-green-500">{differenceInDays}</span>;
    }
  };

  if (!marketHolidays.length) {
    return <Card data-testid="market-holidays">NO MARKET HOLIDAYS DATA</Card>;
  }

  return (
    <Card>
      <Title>Upcoming market holidays</Title>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Exchange</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Day left</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {marketHolidays
            .slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span className="text-white">{item.date}</span>
                </TableCell>
                <TableCell>
                  <span className="text-white">{item.exchange}</span>
                </TableCell>
                <TableCell>
                  <span className="text-white">{item.name}</span>
                </TableCell>
                <TableCell>{dateComparison(item.date)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Button
          className="mr-2"
          variant="secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(marketHolidays.length / ITEMS_PER_PAGE)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(marketHolidays.length / ITEMS_PER_PAGE)
          }
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

export default MarketHoliday;

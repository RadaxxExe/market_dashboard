## Project

This project is the technical test for the Alliance Gravity company.

It's a dashboard that displays various data on stock prices using the Polygon.io API.

Please note that the gratuit tier of the Polygon.io API only allows 5 API calls per minute.
To mitigate this problem a little, all API calls are persisted in the cache, but if too many calls are made, the server will return a 429 error.

## Project architecture

The Market Overview page displays general stock market data.
Here are its components:

- Opening/closing status of major stocks
- Index opening/closing status
- Currencies (Crypto/Forex) opening/closing status
- Summary table of days when stock markets are closed.
  Closed days >60 days, between 60/90 days and +90 days are color-coded in red.

On the Stocks page, you can find information on the price of a specific share.

- The AC button to the right of the search bar can be used to activate or deactivate autocomplete.
  Warning: autocomplete makes several API calls, and overusing it will return an error 429.
- The MarketDetail component displays a summary of the company that owns the stock you're looking for.
- The Stock Evolution component displays the High/Low, Open/Close and volume evolution of the stock searched for between 2 dates - the user can manually change the dates of interest using the date picker.
- The last component, Financial Data, displays various information on the company's financial status

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To start the unit test use:

```bash
npm run test
```

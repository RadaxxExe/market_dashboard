export enum OPENING_STATUS {
  OPEN = "open",
  CLOSED = "closed",
  EXTENDED_HOURS = "extended-hours",
}

export interface TickerFinancialData {
  data: {
    company_name: string;
    fiscal_year: string;
    fiscal_period: string;
    assets: number;
    equity: number;
    net_cash_flow: number;
    comprehensive_income: number;
    gross_profit: number;
    net_income_loss: number;
  }[];
}

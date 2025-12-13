export interface LedgerReportFilter {
  account_id?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface BalanceSheetReportFilter {
  date?: Date;
}

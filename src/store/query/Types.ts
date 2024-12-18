import { SoDataSourceProps } from "app/containers/Sales/SaleOrders/Types";
import { BillDataSourceProps } from "app/containers/Purchases/Bills/Types";
import { CurrencyDataSource } from "app/containers/Settings/Currency/Types";
import { DataSourceProps, ItemStockProps } from "app/containers/Items/Types";
import { CustomerDetailPropTypes } from "app/containers/Sales/Customers/Types";
import { EstimatedataSourceProps } from "app/containers/Sales/Estimates/Types";
import { PODataSourceType } from "app/containers/Purchases/PuchaseOrders/Types";
import { InvoiceDataSourceProps } from "app/containers/Sales/PaymentsReceived/Types";
import { RefundDataSourceProps } from "../../app/containers/Sales/PaymentsReceived/Types";
import { CategoriesType } from "app/containers/Items/Categories/Types";

export type PaginationProps = {
  sort?: string;
  filter?: string;
  pageSize: number;
  sort_by?: string;
  order_by?: string;
  sort_column?: string;
  current?: number | string;
  page?: number | string;
  contact_type?: string;
  searchByAlphabet?: string;
  current_balance?: string;
  start_range?: number;
  end_range?: number;
  paginate?: any;
  sidebarPosition?: any;
};

export type ItemDetailsTypes = DataSourceProps & {
  stocks: ItemStockProps;
};

export type ItemDataSource = {
  total: number;
  data: ItemDetailsTypes[];
};

export type ItemQueryResponse = {
  items: ItemDataSource;
  itemss: ItemDataSource;
  images_bucket?: string | null;
  base_currency: CurrencyDataSource;
  table_setting: any;
  show_onboard_screen:boolean
};

export type CustomerDataSource = Pick<ItemDataSource, "total"> & {
  data: CustomerDetailPropTypes[];
  next_page_url: number | null;
  current_page: number;
  last_page: number;
};

export type CustomerQueryResponse = Pick<ItemQueryResponse, "base_currency"> & {
  contacts: CustomerDataSource;
  show_onboard_screen: boolean;
};

export type EstimateDataSource = Pick<ItemDataSource, "total"> & {
  data: EstimatedataSourceProps[];
};

export type EstimateQueryResponse = {
  estimates: EstimateDataSource;
  show_onboard_screen: boolean;
};

export type ExpensesDataSource = Pick<ItemDataSource, "total"> & {
  data: any[]; // ExpensesdataSourceProps[];
};

export type ExpensesQueryResponse = {
  expenses: ExpensesDataSource;
};

export type SalesOrderSourceData = Pick<ItemDataSource, "total"> & {
  data: SoDataSourceProps[];
};

export type SalesOrderQueryResponse = {
  salesOrders: SalesOrderSourceData;
};

export type InvoiceSourceData = Pick<ItemDataSource, "total"> & {
  data: InvoiceDataSourceProps[];
};

export type InvoiceQueryResponse = {
  invoices: InvoiceSourceData;
  show_onboard_screen:boolean;
};

export type ExpenseSourceData = Pick<ItemDataSource, "total"> & {
  data: InvoiceDataSourceProps[];
};

export type ExpenseQueryResponse = {
  expenses: ExpenseSourceData;
};

export type PaymentReceiveData = Pick<ItemDataSource, "total"> & {
  data: RefundDataSourceProps[];
};

export type PaymentReceiveQueryResponse = {
  advancePayments: PaymentReceiveData;
};

export type PurchaseOrderDataSource = Pick<ItemDataSource, "total"> & {
  data: PODataSourceType[];
};

export type PurchaseOrderQueryResponse = {
  purchaseOrders: PurchaseOrderDataSource;
};

export type BillDataTypes = Pick<ItemDataSource, "total"> & {
  data: BillDataSourceProps[];
};

export type BillQueryResponse = {
  bills: BillDataTypes;
  show_onboard_screen:boolean;

};

export type RecurringInvoiceTypes = Pick<ItemDataSource, "total"> & {
  data: BillDataSourceProps[];
};

export type RecurringInvoiceQueryResponse = {
  recurring_invoices: RecurringInvoiceTypes;
};

export type CategoriesDataTypes = Pick<ItemDataSource, "total"> & {
  data: CategoriesType[];
};

export type CategoriesQueryResponse = {
  data: CategoriesDataTypes;
};

// export type BillPaymentsDataTypes = Pick<ItemDataSource, "total"> & {
//   data: BillDataSourceProps[];
// };

// export type BillPaymentsQueryResponse = {
//   bills: BillDataTypes;
// };

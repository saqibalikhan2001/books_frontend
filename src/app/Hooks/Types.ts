import { AxiosResponse } from "axios";

export interface initialState {
  details: {
    bill_no: string;
    payment_no: string;
    invoice_no: string;
    sales_order_no: string;
    purchase_order_no: string;
  };
  vendors: object[];
  taxList: object[];
  itemUnits: string[];
  warehouses: string[];
  salesPerson: object[];
  base_currency: object;
  paymentModes: object[];
  account_groups: object;
  purchaseAccount: object[];
}

export type ActionTypes = {
  type: string;
  payload: any;
};

export interface AxiosParams {
  org?: string | number | null;
  method?: "post" | "get" | "patch" | "put" | "delete";
  data?: object;
  url: string;
  isJsonType?: boolean;
  all?: any;
  deploymentTime?: boolean;
}

export type axiosResponse = {
  sku?: string;
  message: string;
  modules?: string;
  disabled_currency?: boolean;
} & AxiosResponse;

export type SelectOption = {
  [x: string]: any;
  label: string;
  value: string;
}[];

export interface SearchParamsTypes {
  sort?: string;
  current?: number;
  pageSize?: number;
  sort_column?: string;
}

import { RecurringInvoiceTypes } from "store/query/Types";
import {
  ItemObjProps,
  ItemTaxProps,
  ValuesProps,
  WarehouseProps,
  CustomerObjProps,
  BaseCurrecnyProps,
} from "../Types";

export type RecurringInvoiceFormProps = {
  url: string;
  create?: boolean;
  loading: boolean;
  isModal?: boolean;
  close?: () => void;
  handleTotal: (total: number) => void;
  onSubmit: (values: ValuesProps) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handleItemList: (items: RecurringInvoiceDataSourceProps[]) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

export type RecurringInoviceSubmit = ValuesProps;

export interface RecurringInvoiceDataSourceProps {
  id: number;
  name: string;
  note: string;
  total: number;
  status: string;
  order_no: string;
  due_date: string;
  deleted_at: string;
  created_at: string;
  created_by: number;
  invoice_no: string;
  adjustment: number;
  updated_at: string;
  customer_id: number;
  payment_due: number;
  sync_order: boolean;
  currency_id: number;
  invoice_date: string;
  display_name: string;
  platform_type: string;
  discount_type: string;
  payment_status: string;
  discount_level: string;
  organization_id: number;
  shipping_charge: number;
  original_status: string;
  billing_address: string;
  shipping_address: string;
  invoice_term_value: null;
  invoice_term_name: string;
  customer: CustomerObjProps;
  estimate_id: null | number;
  is_active: boolean | number;
  currency: BaseCurrecnyProps;
  terms_and_condition: string;
  sales_person_id: null | number;
  billing_address_id: null | number;
  shipping_address_id: null | number;
  discount_transaction_level: number;
}

export type RecurringInvoiceListingProps = {
  loading: boolean;
  showDetail: boolean;
  refetch: () => void;
  bulkDeleteTrue: () => void;
  listing: RecurringInvoiceTypes;
  handleConfirm: (id: number) => void;
  handleClick: (data: RecurringInvoiceDataSourceProps) => void;
  handleViewClick: (dt: RecurringInvoiceDataSourceProps, listing: any) => void;
};
export interface PaymentTermModalProps {
  org_terms: {
    id: number;
    name: string;
    value: string;
    updated_at: string;
    created_at: string;
    platform_type: string;
    deleted_at: null | string;
    created_by: null | string;
    deletable: boolean | number;
    organization_id: null | number;
  }[];
  visible: boolean;
  toggle: () => void;
  refetch: () => void;
}

export type DetailPageProps = {
  detail: {
    id: number;
  };
  dataLength?: number;
  deleteItem?: boolean;
  refetchInvoices: () => void;
  handleFullScreen: (state: boolean) => void;
};

export type InvoiceInfo_InvoiceDetail_props = {
  id: number;
  rate: number;
  amount: number;
  item_id: number;
  quantity: number;
  tax_name: string;
  item_name: string;
  sort_order: number;
  invoice_id: number;
  created_at: string;
  created_by: number;
  deleted_at: string;
  item: ItemObjProps;
  updated_at: string;
  sales_order_id: null;
  warehouse_id: number;
  discount_type: string;
  platform_type: string;
  tax_id: null | number;
  tax_rate: null | number;
  organization_id: number;
  tax: ItemTaxProps | null;
  extra_description: string;
  tax_amount: null | number;
  discount_item_level: number;
  estimate_item_detail_id: null | number;
  sales_order_item_detail_id: null | number;
  sales_order_item_detail: SOItemDetailProps[];
};

export type SOItemDetailProps = {
  rate: number;
  label: string;
  item_id: number;
  item_name: string;
  tax: ItemTaxProps;
  items: ItemObjProps;
  warehouse_id: number;
  tax_id: null | number;
  discount_type: string;
  ordered_quantity: number;
  invoiced_quantity: number;
  extra_description: string;
  remaining_quantity: number;
  discount_item_level: number;
  sales_order_item_detail_id: number;
};

export type InvoiceInfoDetailProps = {
  id: number;
  total: number;
  status: string;
  due_date: string;
  order_no: string;
  invoice_no: string;
  adjustment: number;
  invoice_date: string;
  shipping_charge: number;
  terms_and_condition: string;
  customer: CustomerObjProps;
  invoice_details: InvoiceInfo_InvoiceDetail_props[];
};
export interface InvoiceDetailProps {
  warehouses: WarehouseProps[];
  base_currency: BaseCurrecnyProps;
  invoice_info: InvoiceInfoDetailProps;
}

export type CustomTermProps = {
  id: number;
  value: string;
  label: string;
  org_id: number;
};

export type PaymentTermSubmit = CustomTermProps;

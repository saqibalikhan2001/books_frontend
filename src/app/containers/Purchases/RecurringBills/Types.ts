import { FormInstance } from "antd";
import { BillDataTypes } from "store/query/Types";
import {
  ItemObjProps,
  ItemTaxProps,
  WarehouseProps,
  CustomerObjProps,
  BaseCurrecnyProps,
} from "../../Sales/Types";
import { BillCreatorProps, BillItemObjProps } from "../Bills/Types";

export type InvoiceFormProps = {
  url: string;
  loading: boolean;
  create?: boolean;
  isModal?: boolean;
  close?: () => void;
  handleTotal?: (total: number) => void;
  onSubmit: (values: SubmitValues) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handleItemList?: (items: RecurringBillDataSource[]) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

export interface RecurringBillDataSource {
  adjustment: number;
  balance_due: number;
  bill_date: string;
  bill_no: string;
  billing_address: null | string;
  billing_address_id: null | number;
  created_at: string;
  created_by: number;
  currency: BaseCurrecnyProps;
  currency_id: number;
  deleted_at: null | string;
  discount_transaction_level: number;
  discount_type: null | string;
  display_name: string;
  due_date: string;
  end_date: string;
  id: number;
  is_active: number;
  is_billed_from_receive: number;
  is_receive_from_bill: null | string;
  next_recurring_bills_date: string;
  note: null | string;
  order_no: null | string;
  organization_id: number;
  original_bills_id: null | number;
  original_status: string;
  payment_status: null | string;
  platform_type: string;
  profile_name: string;
  recurring_bills: number;
  recurring_status: string;
  repeat_duration: string;
  start_date: string;
  status: string;
  terms_and_condition: null | string;
  total: number;
  updated_at: string;
  vendor: CustomerObjProps;
  vendor_id: number;
}

export type RecurringBillListingProps = {
  total?: number;
  loading: boolean;
  refetch: () => void;
  showDetail: boolean;
  listing: BillDataTypes;
  bulkDeleteTrue: () => void;
  handleClick: (dt: RecurringBillDataSource) => void;
  handleConfirm: (dt: RecurringBillDataSource) => void;
  handleViewClick: (dt: RecurringBillDataSource, ls: RecurringBillDataSource[]) => void;
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
export interface RepeatModalProps {
  form: FormInstance;
  toggle: () => void;
  visible: boolean;
  repeat_duration: RepeatDuration[];
}
export type RepeatDuration = {
  id: string | number;
  value: string;
  label: string;
};

export type SubmitValues = {
  vendor_id: any;
  bill_terms: any;
  adjustment: number;
  repeat_duration: any;
} & Pick<RecurringBillInfoDetail, "start_date" | "end_date">;

export type DetailPageProps = {
  detail: {
    id: number;
  };
  deleteItem?: boolean;
  dataLength?: number;
  refetchBills: () => void;
  handleFullScreen: (state: boolean) => void;
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

export type RecurringBillInfoDetail = {
  id: number;
  note: string;
  total: number;
  status: string;
  bill_no: string;
  order_no: string;
  due_date: string;
  end_date: string;
  vendor_id: number;
  is_active: number;
  bill_date: string;
  start_date: string;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  created_by: number;
  adjustment: number;
  currency_id: number;
  balance_due: number;
  profile_name: string;
  discount_type: string;
  platform_type: string;
  payment_status: string;
  billing_address: string;
  repeat_duration: string;
  recurring_bills: number;
  organization_id: number;
  original_status: string;
  recurring_status: string;
  vendor: CustomerObjProps;
  purchase_orders: object[]; // for future use
  terms_and_condition: string;
  is_receive_from_bill: string;
  is_billed_from_receive: number;
  original_bills_id: null | number;
  next_recurring_bills_date: string;
  billing_address_id: null | number;
  bill_created_by: BillCreatorProps;
  discount_transaction_level: number;
  bill_item_details: BillItemObjProps[];
};
export interface RecrringBillDetail {
  warehouses: WarehouseProps[];
  base_currency: BaseCurrecnyProps;
  bill_info: RecurringBillInfoDetail;
}

export type CustomTermProps = {
  id: number;
  value: string;
  label: string;
  org_id: number;
};

export type InvoiceTermSubmitProps = CustomTermProps;

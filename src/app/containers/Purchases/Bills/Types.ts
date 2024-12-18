import {
  BaseCurrecnyProps,
  CustomerObjProps,
  ItemObjProps,
  ItemTaxProps,
  ValuesProps,
  WarehouseProps,
} from "app/containers/Sales/Types";
import { BillDataTypes } from "store/query/Types";

export type BillFormProps = {
  items?: any;
  url: string;
  edit?: boolean;
  POdetails?: any;
  loading: boolean;
  contactObj?: any;
  create?: boolean;
  isModal?: boolean;
  close?: () => void;
  setContactObj?: any;
  handleTotal: (total: number) => void;
  handleItemList: (items: any) => void;
  onSubmit: (values: ValuesProps) => void;
  supplierFromSupplier?: any;
};
export type BillSumitProps = ValuesProps;

export type BillListingProps = {
  total?: number;
  loading: boolean;
  refetch: () => void;
  showDetail: boolean;
  listing: BillDataTypes;
  bulkDeleteTrue: () => void;
  handleClick: (dt: BillDataSourceProps) => void;
  handleConfirm: (dt: BillDataSourceProps) => void;
  handleViewClick: (dt: BillDataSourceProps, ls: BillDataSourceProps[]) => void;
};

export type DetailPageProps = {
  detail: {
    id: number;
  };
  loading: boolean;
  setFalse: any;
  deleteItem?: boolean;
  dataLength?: number;
  refetchBills: () => void;
  handleFullScreen: (state: boolean) => void;
};

export type BillItemDetailProps = {};

export type BillItemObjProps = {
  id: number;
  rate: number;
  amount: number;
  bill_id: number;
  item_id: number;
  quantity: number;
  tax_name: string;
  tax_rate: number;
  is_active: number;
  item_name: string;
  sort_order: number;
  account_id: number;
  created_by: number;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  warehouse_id: number;
  tax_id: null | number;
  platform_type: string;
  organization_id: number;
  tax: ItemTaxProps | null;
  item: ItemObjProps | null;
  extra_description: string;
  purchase_order_id: string;
  warehouses: WarehouseProps | null;
  purchase_order_item_detail_id: null | number;
};
export type BillCreatorProps = {
  id: number;
  name: string;
  email: string;
  current_organization_id: number;
  users_organizations: object[]; /// for future use
  current_organization_limits: Object; // for future use
};

export interface BillInfoProps {
  id: number;
  note: string;
  total: number;
  status: string;
  bill_no: string;
  order_no: string;
  due_date: string;
  vendor_id: number;
  is_active: number;
  bill_date: string;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  created_by: number;
  adjustment: number;
  currency_id: number;
  balance_due: number;
  discount_type: string;
  platform_type: string;
  payment_status: string;
  billing_address: any;
  organization_id: number;
  original_status: string;
  vendor: CustomerObjProps;
  purchase_orders: object[]; // for future use
  terms_and_condition: string;
  is_receive_from_bill: string;
  is_billed_from_receive: number;
  billing_address_id: null | number;
  bill_created_by: BillCreatorProps;
  discount_transaction_level: number;
  bill_item_details: BillItemObjProps[];
}
export interface BillDetailProps {
  bill_info: BillInfoProps;
  warehouses: WarehouseProps;
  base_currency: BaseCurrecnyProps;
}

export type BillDataSourceProps = {
  id: number;
  name: string;
  note: string;
  total: number;
  status: string;
  bill_no: string;
  order_no: string;
  due_date: string;
  vendor_id: number;
  bill_date: string;
  is_active: number;
  adjustment: number;
  created_at: string;
  created_by: number;
  updated_at: string;
  deleted_at: number;
  balance_due: number;
  currency_id: number;
  display_name: string;
  discount_type: string;
  platform_type: string;
  payment_status: string;
  billing_address: string;
  organization_id: number;
  original_status: string;
  vendor: CustomerObjProps;
  currency: BaseCurrecnyProps;
  terms_and_condition: string;
  is_receive_from_bill: string;
  is_billed_from_receive: number;
  billing_address_id: null | number;
  discount_transaction_level: number;
};

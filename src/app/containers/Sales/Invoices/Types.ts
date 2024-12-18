import { InvoiceSourceData } from "store/query/Types";
import {
  ItemObjProps,
  ItemTaxProps,
  ValuesProps,
  WarehouseProps,
  CustomerObjProps,
  BaseCurrecnyProps,
} from "../Types";
import { FormInstance } from "antd";
import { SODetailProps } from "../SaleOrders/Types";

export type InvoiceFormProps = {
  item?: any;
  url: any;
  // url: string;
  edit?: boolean;
  contactObj: any;
  loading: boolean;
  create?: boolean;
  isModal?: boolean;
  setContactObj: any;
  close?: () => void;
  discount_level?: string;
  toggleModal?: () => void;
  customerFromCustomer?: any;
  onSubmit: (values: any) => void;
  toggleEstimateInvoiceModal?: any;
  handleTotal: (total: number) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handleItemList: (items: InvoiceDataSourceProps[]) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

export type InoviceSubmitProps = ValuesProps;

export interface InvoiceDataSourceProps {
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

export type InvoiceListingProps = {
  loading: boolean;
  showDetail: boolean;
  refetch: () => void;
  listing: InvoiceSourceData;
  bulkDeleteTrue: () => void;
  handleConfirm: (id: number) => void;
  handleClick: (data: InvoiceDataSourceProps) => void;
  handleViewClick: (dt: InvoiceDataSourceProps, listing: InvoiceDataSourceProps[]) => void;
};

export type InvoiceListingProp = {
  status: any;
  listing: any;
  setparam: any;
  pagination: any;
  Next: () => void;
  loading: boolean;
  className: String;
  Prev: () => void;
  showDetail: boolean;
  refetch: () => void;
  sidebarPosition?: any;
  handlePage: (val) => void;
  handleRowSize: (val) => void;
  handleConfirm: (id: number) => void;
  handleFullScreen: (state: boolean) => void;
  handleClick: (data: InvoiceDataSourceProps) => void;
  setcustomLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleViewClick: (dt: InvoiceDataSourceProps, listing: InvoiceDataSourceProps[]) => void;
};
export interface InvoiceModalProps {
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
  setIsTermModalOpen?: boolean;
  estimate_form?: FormInstance;
  invoice_form?: FormInstance;
  bill_form?: FormInstance;
  bill?: Boolean;
}

export type DetailPageProps = {
  detail: any;
  boolean?: any;
  from?: string;
  dataLength?: number;
  deleteItem?: boolean;
  loading?: boolean;
  handleConfirm?: any;
  data?: any;
  isModal?: boolean;
  setparam?: any;
  setFalse?: any;
  refetchInvoices?: any;
  detailpage?: boolean;
  handleFullScreen?: (state: boolean) => void;
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
  deleteable?: number | boolean;
  customer: CustomerObjProps;
  invoice_details: InvoiceInfo_InvoiceDetail_props[];
};
export interface InvoiceDetailProps {
  invoice_info: InvoiceInfoDetailProps;
  invoice_term_name: any;
  created_at: any;
  item: any;
  customer: any;
  warehouses: WarehouseProps[];
  base_currency: BaseCurrecnyProps;
  users_organizations;
}

export type CustomTermProps = {
  id: number;
  value: string;
  label: string;
  name: string;
  org_id: number;
};

export type CreateInvoiceProps = {
  url?: any;
  bool?: boolean;
  isModal?: boolean;
  refetchSO?: () => void;
  has_permission?: boolean;
  toggleModal?: any;
  SOdetails?: SODetailProps;
  refetchInvoices?: any;
  refetchEstimates?: any;
  estimateDetails?: any;
};
export type InvoiceTerm = {
  invoice_terms: CustomTermProps[];
};
export type DetailInvoiceInfoProps = {
  note: string;
  platform_type: string;
  discount_type: string;
  invoice_details: InvoiceInfo_InvoiceDetail_props[];
  discount: number;
  discount_transaction_level: number;
  id: number;
  terms_and_condition: string;
  base_currency: BaseCurrecnyProps;
  discount_level: string;
  shipping_charge: number;
  adjustment: number;
  total: number;
  payment_made: number;
  payment_via_credits: number;
  payment_due: number;
};
export type DetailInvoiceProps = {
  note: string;
  platform_type: string;
  invoice_info: DetailInvoiceInfoProps;
};
export type DetailInvoiceTableProps = {
  setDetails?: any;
  isModal?: Boolean;
  details: DetailInvoiceProps;
};
export type DetailPlusListingProps = {
  invoices: any;
  filter_preference: any;
};

export type InvoiceFilterProps = {
  form: any;
  pagination: any;
  refetch: () => void;
  filterPreference: any;
  setparam: (pagination: any) => void;
  handleOpenChange: (pop: boolean) => void;
};
export type DetailpageHeaderProps = {
  showDetail: boolean;
  form: any;
  pagination: any;
  Prev: () => void;
  Next: () => void;
  popOver: boolean;
  navigateTo: string;
  moduleName: string;
  refetch: () => void;
  sortPopOver: boolean;
  selectedProducts: any;
  filterPreference?: any;
  handlePage: (val) => void;
  handleRowSize: (val) => void;
  listing: DetailPlusListingProps;
  setparam: (pagination: any) => void;
  handleOpenChange: (pop: boolean) => void;
  handleFullScreen: (state: boolean) => void;
  handleSortPopOver: (popover: boolean) => void;
};

export type SelectedRowsProps = {
  showDetail: boolean;
  selectedProducts: any;
  items: any;
};

export type FilterPopupProps = Pick<
  DetailpageHeaderProps,
  | "pagination"
  | "handleOpenChange"
  | "popOver"
  | "form"
  | "setparam"
  | "showDetail"
  | "refetch"
  | "filterPreference"
>;

export type InvoiceTermSubmitProps = InvoiceTerm;

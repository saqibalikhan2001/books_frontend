import { EstimateDataSource } from "store/query/Types";
import { SOItemObjProps } from "../SaleOrders/Types";
import { ValuesProps, WarehouseProps, BaseCurrecnyProps, CustomerObjProps } from "../Types";

export type EstimateFormProps = {
  item?: any;
  url: string;
  edit?: boolean;
  contactObj: any;
  setContactObj: any;
  create?: boolean;
  loading: boolean;
  handleItemList: (items: any) => void;
  handleTotal: (total: number) => void;
  onSubmit: (values: EstimateSubmitProps) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

// export type EstimateSubmitProps = ValuesProps;
export type EstimateItemObjProps = SOItemObjProps;

export interface EstimateSubmitProps {
  values: {
    billing_address_id: { id: number; label: string };
    customer_email: string | null;
    customer_note: string;
    discount_level: any;
    estimate_date: string;
    estimate_no: string;
    expiry_date: string;
    payment_terms: any;
    reference: number;
    sales_person_id?: any;
    shipping_charge: any;
    terms_and_condition: string;
    adjustment: any;
    saveAs: string;
    transaction_level_discount_type: any;
    discount_transaction_level: any;
  };
}
export interface EstimatedataSourceProps {
  id: number;
  name: string;
  total: number;
  status: string;
  reference: string;
  order_date: string;
  updated_at: string;
  created_at: string;
  adjustment: number;
  deleted_at: string;
  created_by: number;
  customer_id: number;
  currency_id: number;
  estimate_no: string;
  shipping_tax: number;
  display_name: string;
  warehouse_id: number;
  platform_type: string;
  shipping_charge: number;
  organization_id: number;
  invoice_id: null | number;
  currency: BaseCurrecnyProps;
  customer_note: string;
  discount_type: string;
  package_status: string;
  invoice_status: string;
  convert_status: string;
  // discount_level: string;
  sales_orders_id: null | number;
  billing_address: string;
  // clone_status: number;
  expected_shipment_date: string;
  sales_person_id: null | number;
  shipment_status: string;
  // backorder_status: string;
  shipping_address: string;
  // billing_address_id: null | number;
  // delivery_method_id: null | number;
  // discount_transaction_level: number;
  // shipping_address_id: null | number;
  terms_and_condition: string;
  // itemStock: { out_of_stock: boolean };
  // dropship_status: null | string;
}

export interface EstimateListingProps {
  loading: boolean;
  showDetail: boolean;
  refetch: () => void;
  bulkDeleteTrue: () => void;
  listing: EstimateDataSource;
  handleConfirm: (dt: EstimatedataSourceProps) => void;
  handleClick: (data: EstimatedataSourceProps) => void;
  handleViewClick: (dt: EstimatedataSourceProps, listing: EstimatedataSourceProps[]) => void;
}

export interface EstimateDetailPageProps {
  detail: {
    id: number;
  };
  detailpage?: boolean;
  dataLength?: number;
  refetch?: () => void;
  deleteItem?: boolean;
  loading?: any;
  setFalse?: any;
  handleConfirm?: any;
  data?: any;
  setparam?: any;
  isModal?: boolean;
  handleFullScreen?: any;
}

export interface EstimateDetailProps {
  tax: any;
  id: number;
  name?: string;
  photo: string;
  total: number;
  status: string;
  reference: string;
  attachments?: any;
  adjustment: number;
  customer_id: number;
  estimate_no: string;
  display_name: string;
  billing_address: any;
  expiry_date?: string;
  customer_note: string;
  platform_type: string;
  estimate_date?: string;
  shipping_charge: number;
  payment_term_name: string;
  contact: CustomerObjProps;
  terms_and_condition: string;
  base_currency: BaseCurrecnyProps;
  is_attachment_deletable?: boolean;
  itemStock: { out_of_stock: boolean };
  preference_list: object; // for future
  warehouse_list: WarehouseProps[];
  estimates_details: EstimateDetailPageProps[];
}

export interface EmailProps {
  handleEmail: () => void;
  details: EstimateDetailProps | undefined;
  setEmail: any;
}

export interface TaxModalTypes {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export type EstimateAttachements = {
  details: EstimateDetailProps | undefined;
  setIsBool: (state: boolean) => void;
  attachments: any;
  handleImage: (e: any) => void;
  multipleDownloads: () => void;
  singleAttachmentDelete: (id: Number) => void;
};

export type DetailEstimateInfoProps = {
  id: number;
  total: number;
  adjustment: number;
  invoice_details: any;
  customer_note: string;
  platform_type: string;
  discount_type: string;
  discount_level: string;
  shipping_charge: number;
  estimates_details: any[];
  terms_and_condition: string;
  base_currency: BaseCurrecnyProps;
  discount_transaction_level: number;
};
export type DetailpageHeaderProps = {
  form: any;
  listing: any;
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
  setparam: (pagination: any) => void;
  handleOpenChange: (pop: boolean) => void;
  handleFullScreen: (state: boolean) => void;
  handleSortPopOver: (popover: boolean) => void;
  showDetail?: any;
};
export type DetailEstimateTableProps = {
  setDetails: any;
  details: DetailEstimateInfoProps;
  isModal?: boolean;
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
  | "filterPreference"
  | "refetch"
  | "showDetail"
>;
export type EstimateFilterProps = Pick<
  DetailpageHeaderProps,
  "pagination" | "handleOpenChange" | "form" | "setparam" | "filterPreference" | "refetch"
>;

export type AddressModalProps = {
  url: string;
  loading: boolean;
  onSubmit: (values: ValuesProps) => void;
  setEditBill: any;
  bool: boolean;
  handleCancel: any;
  setCreateBill: any;
  setBillLoading: any;
  editBill: boolean;
  createBill: boolean;
  billing?: any;
  contactForm?: boolean;
};

export type EstimateListingProp = {
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
  handleClick: (data: EstimatedataSourceProps) => void;
  setcustomLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleViewClick: (dt: EstimatedataSourceProps, listing: EstimatedataSourceProps[]) => void;
};
// export interface EstimateDetailsProps {
//   id: number;
//   packed: number;
//   rate: number;
//   amount: number;
//   shipped: number;
//   item_id: number;
//   quantity: number;
//   invoiced: number;
//   delivered: number;
//   item_name: string;
//   created_at: string;
//   sort_order: number;
//   updated_at: string;
//   created_by: number;
//   items: ItemObjProps;
//   direct_sale: number;
//   dropshipped: number;
//   estimate_id: number;
//   backordered: number;
//   tax_id: null | number;
//   platform_type: string;
//   tax_name: null | string;
//   tax_rate: null | number;
//   organization_id: number;
//   tax: ItemTaxProps | null;
//   invoice_id: null | number;
//   tax_amount: null | number;
//   deleted_at: null | string;
//   warehouse_id: number | null;
//   discount_item_level: number;
//   discount_type: null | string;
//   sales_orders_id: null | number;
//   extra_description: null | string;
//   warehouses: WarehouseObjProps | null;
//   invoice_item_details_id: null | number;
//   sales_order_item_details_id: null | number;
// }

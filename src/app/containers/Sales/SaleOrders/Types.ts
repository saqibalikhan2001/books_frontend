import { SalesOrderSourceData } from "store/query/Types";
import { BaseCurrecnyProps, ValuesProps } from "../Types";
import { ItemTaxProps, ItemObjProps, WarehouseProps } from "../Types";

export type SalesOrderFormProps = {
  url: string;
  loading: boolean;
  handleTotal: (total: number) => void;
  onSubmit: (values: ValuesProps) => void;
  handleItemList: (items: SOItemObjProps[]) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

export type SOsubmitProps = ValuesProps;

export type SOCommonProps = {
  id: number;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  created_by: number;
  warehouse_id: number;
  discount_type: string;
  platform_type: string;
  organization_id: number;
};

export type SoDataSourceProps = {
  id: number;
  name: string;
  total: number;
  status: string;
  reference: string;
  order_date: string;
  adjustment: number;
  customer_id: number;
  currency_id: number;
  clone_status: number;
  shipping_tax: number;
  display_name: string;
  customer_note: string;
  discount_level: string;
  package_status: string;
  invoice_status: string;
  sales_order_no: string;
  shipment_status: string;
  dropship_status: string;
  billing_address: string;
  shipping_charge: number;
  shipping_address: string;
  backorder_status: string;
  estimate_id: null | number;
  terms_and_condition: string;
  currency: BaseCurrecnyProps;
  expected_shipment_date: string;
  sales_person_id: null | number;
  billing_address_id: null | number;
  delivery_method_id: null | number;
  shipping_address_id: null | number;
  discount_transaction_level: number;
  itemStock: { out_of_stock: boolean };
} & SOCommonProps;

export type SOItemObjProps = {
  rate: number;
  packed: number;
  tax_id: number;
  amount: number;
  item_id: number;
  shipped: number;
  invoiced: number;
  quantity: number;
  tax_rate: number;
  tax_name: string;
  delivered: number;
  tax: ItemTaxProps;
  item_name: string;
  tax_amount: number;
  sort_order: number;
  direct_sale: number;
  backordered: number;
  dropshipped: number;
  items: ItemObjProps;
  sales_order_id: number;
  extra_description: string;
  discount_item_level: number;
  warehouses: WarehouseProps;
  estimate_item_detail_id: null | number;
} & SOCommonProps;

export type SODetailProps = {
  // shipments: object[];
  // dropshipments: object[];
  sales_person: null | object;
  base_currency: BaseCurrecnyProps;
  sales_order_details: SOItemObjProps[];
  // preference_list: { discount_preference: object };
} & Omit<SoDataSourceProps, "currency">;

export type SalesOrderListingProps = {
  showDetail: boolean;
  refetch: () => void;
  listing: SalesOrderSourceData;
  bulkDeleteTrue: () => void;
  handleConfirm: (id: number) => void;
  handleClick: (dt: SODetailProps) => void;
  handleViewClick: (record: SoDataSourceProps, listing: SoDataSourceProps[]) => void;
} & Pick<SalesOrderFormProps, "loading">;

export type SalesOrderDetailPageProps = {
  refetchSO: () => void;
  dataLength?: number;
  deleteItem?: boolean;
  detail: Pick<SOCommonProps, "id">;
  handleFullScreen: (state: boolean) => void;
};

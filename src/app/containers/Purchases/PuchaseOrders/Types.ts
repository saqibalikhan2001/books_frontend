// import { EstimateFormProps } from "app/containers/Sales/Estimates/Types";
import { SOItemObjProps } from "app/containers/Sales/SaleOrders/Types";
import { ItemTaxProps, CustomerObjProps, BaseCurrecnyProps, ValuesProps } from "app/containers/Sales/Types";
import { PurchaseOrderDataSource } from "store/query/Types";

// export type PurshaseOrderFormProps = Omit<
//   EstimateFormProps,
//   "setWarehouseId" | "contactObj" | "setContactObj"
// > & {
//   url: string;
// };
export type PurshaseOrderFormProps = {
  item?: any;
  url: string;
  edit?: boolean;
  create?: boolean;
  loading: boolean;
  handleItemList: (items: any) => void;
  handleTotal: (total: number) => void;
  onSubmit: (values: ValuesProps) => void;
  handleWarehouseId?: (primary: string | number) => void;
  handlePrimaryWarehouse?: (primary: string | number) => void;
};

export type POItemProps = {
  id: number;
  ean: string;
  mpn: string;
  sku: string;
  isbn: string;
  name: string;
  brand: string;
  images: object[]; //for future use
  is_active: number;
  auto_added: number;
  created_at: string;
  created_by: number;
  deleted_at: string;
  dimensions: string;
  description: string;
  clone_status: number;
  manufacturer: string;
  item_group_id: number;
  reorder_level: number;
  platform_type: string;
  inventory_type: string;
  group_variant: object[]; //for future use
  manual_updated: number;
  organization_id: number;
  sales_account_id: number;
  sales_unit_price: number;
  sales_description: string;
  opening_stock_value: number;
  purchase_unit_price: number;
  purchase_account_id: number;
  purchase_description: string;
};

export type POItemDetailProps = {
  id: number;
  rate: number;
  amount: number;
  account: object[];
  item_id: number;
  quantity: number;
  tax_name: string;
  item: POItemProps;
  deleted_at: string;
  account_id: number;
  item_name: string;
  updated_at: string;
  created_at: string;
  created_by: number;
  sort_order: number;
  tax_id: null | number;
  platform_type: string;
  tax_rate: null | number;
  organization_id: number;
  direct_purchase: number;
  billed_quantity: number;
  tax: null | ItemTaxProps;
  extra_description: string;
  purchase_order_id: number;
  received_quantity: number;
  tax_amount: null | number;
  cancelled_quantity: number;
};

export type PODataSourceType = {
  id: number;
  total: number;
  status: string;
  reference: string;
  adjustment: number;
  order_date: string;
  updated_at: string;
  created_at: string;
  display_name: string;
  platform_type: string;
  purchase_order_no: string;
};
export interface PurshaseOrderListingProps {
  loading: boolean;
  refetch: () => void;
  showDetail: boolean;
  bulkDeleteTrue: () => void;
  listing: PurchaseOrderDataSource;
  handleClick: (dt: PODataSourceType) => void;
  handleConfirm: (id: PODataSourceType) => void;
  handleViewClick: (dt: PODataSourceType, ls: PODataSourceType[]) => void;
}

export type PurchaseOrderDetailPageProps = {
  dataLength?: number;
  deleteItem?: boolean;
  refetchPO: () => void;
  detail: { id: number };
  handleFullScreen: (state: boolean) => void;
};

export type POItemObjProps = SOItemObjProps;

export interface PODetailProps {
  id: number;
  total: number;
  status: string;
  adjustment: number;
  order_date: string;
  bill_status: string;
  vendor: CustomerObjProps;
  purchase_order_no: string;
  currency: BaseCurrecnyProps;
  expected_delivery_date: string;
  purchase_order_item_details: POItemDetailProps[];
}

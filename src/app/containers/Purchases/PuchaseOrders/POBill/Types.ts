import { BaseCurrecnyProps, CustomerObjProps } from "app/containers/Sales/Types";
import { PODetailProps } from "../Types";

export type PoBillProps = {
  url: string;
  fetchList: boolean;
  refetchPO: () => void;
  refetchBills: () => void;
  POdetail: PODetailProps;
};
export type CreateBillProps = {
  bool: boolean;
  toggleModal: () => void;
  has_permission: boolean;
} & Pick<PoBillProps, "POdetail" | "refetchBills" | "refetchPO" | "url">;

export type BillListingProps = {
  loading: boolean;
  showButton: boolean;
  toggleModal: () => void;
  hasViewPermission: boolean;
  handleCreate: (create: boolean) => void;
  handleClick: (dt: POBillListingProps) => void;
  handleConfirm: (dt: POBillListingProps) => void;
} & Pick<PoBillProps, "url" | "fetchList"> &
  Pick<CreateBillProps, "has_permission">;

export type BillModalProps = {
  edit?: boolean;
  create?: boolean;
  loading: boolean;
  showModal: boolean;
  handleTotal: (total: number) => void;
  onSubmit: (values: ValuesProps) => void;
  handleItemList: (items: BillItemDetailProps[]) => void;
} & Pick<CreateBillProps, "url" | "toggleModal" | "has_permission" | "POdetail">;

export type BillDetailProps = {
  id: number;
};
export type BillEditProps = Omit<CreateBillProps, "url"> & {
  BillDetail?: BillDetailProps;
};

export type BillItemDetailProps = {
  item_ean: string;
  item_id: number;
  item_mpn: string;
  item_sku: string;
  item_upc: string;
  item_isbn: string;
  item_name: string;
  item_unit: string;
  item_type: string;
  stocks: object[]; //for future use
  sort_order: number;
  item_images: object[]; //for future use
  extra_description: string;
  item_inventory_type: string;
  purchase_order_item_account_id: number;
  purchase_order_item_unit_price: number;
  purchase_order_item_warehouse_id: number;
  purchase_order_item_tax_id: number | null;
  quantity_billable_without_received: number;
  purchase_order_item_detail_id: number | null;
};

export type POBillListingProps = {
  id: number;
  note: string;
  total: number;
  status: string;
  bill_no: string;
  order_no: string;
  due_date: string;
  bill_date: string;
  is_active: number;
  vendor_id: number;
  updated_at: string;
  created_at: string;
  adjustment: number;
  created_by: number;
  deleted_at: string;
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
  billing_address_id: number | null;
  discount_transaction_level: number;
};

export type ValuesProps = {
  due_date: string;
  bill_date: string;
};

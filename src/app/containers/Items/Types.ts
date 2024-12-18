import { CurrencyDataSource } from "../Settings/Currency/Types";
import { WarehouseProps } from "../Sales/Types";
import { ItemDataSource } from "store/query/Types";
import type { UploadFile } from "antd/es/upload/interface";

export type ItemFormProps = {
  url: string;
  isModal?: boolean;
  fileList: any;
  isBool?: any;
  edit?: boolean;
  clone?: boolean;
  attachList: any;
  create?: boolean;
  tracked: boolean;
  loading: boolean;
  currentIndex?: any;
  setFileList?: any;
  setAttachList?: any;
  setCurrentIndex?: any;
  deleteAttachments?: any;
  setDeleteAttachments?: any;
  tooltipOverlayClass?: string;
  // fileList: UploadFile[];
  // attachList?: UploadFile[];
  toggleItemModal?: () => void;
  handleFileList: (i: UploadFile[]) => void;
  handleImageList: (i: UploadFile[]) => void;
  handleTrackInventory: (b: boolean) => void;
  onSubmit: (values: ItemValuesProps) => void;
  handleTaxType: (value: string | null) => void;
  // handleImageAttachList: (i: UploadFile[]) => void;
  handleImageAttachList: any;
  // handleImageAttachList: any;
  handleWareshouseList: (w: WarehouseProps[]) => void;
};

export type StockProps = {
  id: number;
  item_id: number;
  created_at: string;
  updated_at: string;
  warehouse_id: number;
  opening_quantity: number;
  physical_quantity: number;
  accounting_quantity: number;
}[];

export type DataSourceProps = {
  id: number;
  images: any;
  sku: string;
  name: string;
  type: string;
  unit: string;
  tax_id: number;
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  stocks: StockProps;
  reorder_level: number;
  platform_type: string;
  physical_stock: number;
  inventory_type: string;
  tax_type: string | null;
  vendor_id: number | null;
  accounting_stock: number;
  sales_unit_price: number;
  sales_account_id: number;
  purchase_account_id: number;
  purchase_unit_price: number;
  opening_stock_value: number;
  quantity_on_hand: number;
  available_stock: number;
};
export interface ItemListingProps {
  loading: boolean;
  className?: string;
  showDetail: boolean;
  refetch: () => void;
  bulkDeleteTrue: () => void;
  listing: ItemDataSource;
  base_currency: CurrencyDataSource;
  handleClick: (data: DataSourceProps) => void;
  handleConfirm: (data: DataSourceProps) => void;
  handleViewClick: (dt: DataSourceProps, listing: DataSourceProps[]) => void;
}

export type ItemValuesProps = {
  tax_id: number;
  tax_type: string;
  opening_stock_value: number;
  name: string;
  sku: string;
  unit: string;
};

export type DetailPageProps = {
  loading?: boolean;
  lastItem?: boolean;
  dataLength?: number;
  deleteItem?: boolean;
  setFalse?: (bool) => void;
  detail: { id: number };
  base_currency?: CurrencyDataSource;
  refetch?: () => void;
  isModal?: boolean;
  handleFullScreen?: any;
  detailpage?: boolean;
  // handleFullScreen: (state: boolean) => void;
};

export type ItemStockProps = {
  id: number;
  item_id: number;
  is_active: number;
  updated_at: string;
  created_at: string;
  created_by: number;
  warehouse_id: number;
  platform_type: string;
  organization_id: number;
  opening_quantity: number;
  warehouse: WarehouseProps;
  physical_quantity: number;
  accounting_quantity: number;
};

export type ItemDetailsProps = {
  reorder_level: number;
  transactionInfo: boolean;
  stocks: ItemStockProps[];
  opening_stock_value: number;
};

export type TrackInventoryProps = {
  create: boolean;
  warehouses: WarehouseProps[];
  itemDetails: ItemDetailsProps;
  handleWareshouseList: (war: WarehouseProps[]) => void;
};

export type Images = {
  name: string;
  old_image: boolean;
};

export type Upload_Images = {
  originFileObj: UploadFile;
};
export type detailPage = {
  base_currency?: CurrencyDataSource;
  data: any;
  setUploading?: any;
  isModal?: boolean;
};

export interface DetailpageForm {
  type: String;
  date: String;
  reason: String;
  description: String;
  warehouse_id: String;
  purchase_account_id: String;
  items: any;
}

export interface ModalProps {
  handleCancel?: any;
  open?: boolean;
  itemDetail?: any;
  className?: string;
  refetch?: any;
}

export interface TableProps {
  warehouseId: null | string;
  handleItemList: (value: any) => void;
  className?: string;
  adjustment: boolean;
  url: string;
  item?: any;
  itemDetail?: any;
  stockPreference?: any;
}
export type Area = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type ImageCropProps = {
  form?: any;
  image: string;
  itemId?: number;
  imagesize?: any;
  setPrimary?: any;
  contact?: boolean;
  orgForm?: boolean;
  handleOk: () => void;
  detailImage?: boolean;
  fileList?: UploadFile[];
  refetch?: () => void;
  handleFileList?: (file: UploadFile[]) => void;
};
export type CreateItemProps = {
  itemObj?: any;
  setItemObj?: any;
  isModal?: boolean;
  toggleItemModal?: () => void;
};

/** @format */

import { ChangeEvent, CSSProperties, Dispatch, MouseEventHandler, ReactNode } from "react";
import { ColProps, MenuProps } from "antd";
import { Rule } from "antd/es/form";
import { OptionProps } from "antd/es/select";
import { ToastPosition } from "react-toastify";
import { ResultStatusType } from "antd/es/result";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FormLabelAlign, NamePath } from "antd/es/form/interface";
import { FilterFunc, DefaultOptionType } from "rc-select/lib/Select";
import { DataSourceProps as ItemPropsTypes } from "app/containers/Items/Types";
// import { AnyAction } from "@reduxjs/toolkit";

export interface Options {
  readonly value: string;
  readonly label: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export type InputFieldProps = {
  innerRef?: any;
  max?: number;
  required?: boolean;
  parser?: any;
  type?: string;
  value?: string;
  rules?: Rule[];
  size?: SizeType;
  colon?: boolean;
  tooltip?: string;
  defaultValue?: any;
  bordered?: boolean;
  suffix?: ReactNode;
  password?: boolean;
  disabled?: boolean;
  className?: string;
  showArrow?: boolean;
  labelCol?: ColProps;
  showButton?: boolean;
  stringMode?: boolean;
  placeholder?: string;
  LeftIcon?: ReactNode;
  style?: CSSProperties;
  hasFeedback?: boolean;
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;
  name?: string | string[];
  handleAddNew?: () => void;
  dependencies?: NamePath[];
  label?: string | ReactNode;
  labelAlign?: FormLabelAlign;
  maxLength?: number;
  prefix?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: any;
  onPaste?: any;
  form?: any;
  customChange?: boolean;
};

export type BtnProps = {
  id?: string;
  block: boolean;
  size?: SizeType;
  icon: ReactNode;
  btnText: string | ReactNode;
  linkTo?: string;
  danger?: boolean;
  loading: boolean;
  className: string;
  disabled?: boolean;
  wrapperCol?: object;
  style: CSSProperties;
  shape: "default" | "round" | "circle";
  htmlType: "submit" | "button" | "reset";
  clickHandler: MouseEventHandler<HTMLElement> | undefined;
  type?: "link" | "text" | "ghost" | "primary" | "default" | "dashed";
};

export type ButtonProps = Partial<BtnProps>;

export type StatusProps = {
  title: ReactNode;
  extra: ReactNode;
  subTitle: ReactNode;
  status: ResultStatusType;
};

type omitKeys = "password" | "LeftIcon" | "addonAfter" | "addonBefore" | "dependencies";

type selectProps = {
  size: SizeType;
  handleSort?: boolean;
  loading?: boolean;
  handleChange?: any;
  handleToggle?: any;
  showSearch?: boolean;
  allowClear?: boolean;
  create_opt?: boolean;
  repeat_opt: boolean;
  clearIcon?: ReactNode;
  suffixIcon?: ReactNode;
  mode?: any;
  optionFilterProp?: string;
  dropdownRender?: ReactNode;
  notFoundContent?: ReactNode;
  status?: "error" | "warning";
  filterSort?: DefaultOptionType;
  filterOption?: FilterFunc<OptionProps>;
  options: object[] | string[] | any;
  defaultValue?: any;
  popupClassName?: string;
  initialValue?: any;
  disabledOption?: any;
  currency?: boolean;
};

export type SelectxProps = Omit<InputFieldProps, omitKeys> &
  Partial<selectProps> & {
    valueLabel?: boolean;
    onlyDisplayname?: boolean;
  };

export type Names = {
  adjustment: number;
  shipping_charge: number;
};

export type Obj = {
  id: number;
  label: string;
};

export type DataSourceProps = {
  unique_id?: number;
  key: string;
  id: number | null;
  item_name: string;
  item_obj?: any;
  tax_rate: number;
  tax_name?: any;
  quantity: number;
  tax_id: number | null;
  tax_amount: number;
  rate: number;
  // discount_transaction_level: any;
  warehouseId?: number | null;
  warehouse_id: number | null;
  extra_description: string;
  total: string | number;
  account_id?: number | null;
  discount_type?: string;
  discount_item_level?: number | null;
  label?: string;
  currency?: string;
  discountAmount?: number;
  item_total_amount?: number;
  item_unit?: string;
  sku: string;
  image: string;
};

export interface String {
  format(...args: [string]): string;
}
export type ItemProps = Omit<DataSourceProps, "item_obj" | "key">;

export type ItemTableProps = {
  form?: any;
  PO_Warehouse_Id?: number | string;
  handleItemList: (items: any) => void;
  handleSubTotal?: (subtotal: number) => void;
  handleTaxTotal?: any;
  handleDiscountTotal?: (discounttotal: any) => void;
  handleAddNew?: () => void;
  names?: Names;
  setTotalAmount: Dispatch<React.SetStateAction<number>>;
  itemList: object[];
  handleWarehouseId?: (primary: string | number) => void;
  edit?: boolean;
  adjustment?: any;
  shipping_charge?: number | string;
  purchaseOrder?: boolean;
  sales?: boolean;
  bills?: boolean;
  purchaseAccount?: object;
  setIsDataSource?: any;
  setIsDiscount?: any;
  url?: string;
  isBool?: any;
  showButton?: boolean;
  discount_level?: string | null;
  taxes?: any;
  warehouses?: object[];
  isModal?: boolean;
  currency?: string;
  handlePrimaryWarehouse?: (primary: string | number) => void;
  handleTaxModal?: any;
  handleDiscountModal?: any;
  totalAmount?: number;
  ModuleName?: string;
  itemUrl?: string;
  current?: any;
  customer_id?: number;
  discount_transaction_level?: number;
  transaction_level_discount_type?: string;
};

export type AlertProps = {
  message: string;
  type?: "success" | "error" | "info";
  position?: ToastPosition;
  autoClose?: boolean;
  draggable?: boolean;
  hideProgressBar?: boolean;
};
export type toastProps = Pick<AlertProps, "message" | "position" | "type">;

export type DatePickerProps = {
  name: string | string[];
  size: SizeType;
  format: string;
  rules?: Rule[];
  is_date: boolean;
  disabled: boolean;
  defaultValue: any;
  isRequired: boolean;
  allowClear?: boolean;
  inputReadOnly?: boolean;
  hidelabel?: boolean;
  ref?: any;
  // disableDate: boolean;
  label: string | ReactNode;
  style: CSSProperties;
  onChange: (value: any) => void;
  showTime: boolean;
  disableDate?: any;
  popupClassName?: string;
};

export interface RenderActionProps {
  data: any;
  bill?: boolean;
  title: string | ReactNode;
  active?: boolean;
  status?: boolean;
  paymentTerm?: boolean;
  invoice?: boolean;
  product?: boolean;
  account?: boolean;
  refunds?: boolean;
  contact?: boolean;
  canEdit?: boolean;
  expense?: boolean;
  estimate?: boolean;
  shipment?: boolean;
  creditnote?: boolean;
  estInvoice?: boolean;
  billPayments?: boolean;
  canMarkSent?: boolean;
  billPayment?: boolean;
  hasModulePermission?: any;
  paymentReceive?: boolean;
  invoicePayment?: boolean;
  deletePermission?: boolean;
  handleClick?: (data: any) => void;
  handleConfirm: (data: any) => void;
  handleStatus?: (data: any) => void;
  handleClone?: (data: any) => void;
  sentMark?: (data: any) => void;
  sendEmail?: (data: any) => void;
  convertToInvoice?: (data: any) => void;
  handlePdfDownload?: (data: any) => void;
  handleBillModal?: (data: any) => void;
  handlePdf?: (data: any) => void;
  handleReceivePaymentModal?: (data: any) => void;
  role?: boolean;
  user?: boolean;
  category?: boolean;
  showDetail?: boolean;
  currentStatus?: string;
  hasTransaction?: boolean;
  markOpen?: (data) => void;
  InvoiceCreditnote?: boolean;
  className?: string;
  classpicker?: string;
  showEdit?: boolean;
  has_joined?: boolean;
  okText?: string;
}

export type OptionPropss =
  | string[]
  | {
      id: string | number;
      label: string;
      value?: string;
    }
  | {
      id: string | number;
      title: string;
    }
  | {
      id: string | number;
      name: string;
      accounts: {
        id: string | number;
        title: string;
      }[];
    }
  | {
      id: string | number;
      name: string;
      rate: string | number;
    }
  | {
      id: string | number;
      display_name: string;
    }
  | {
      id: string | number;
      symbol: string;
    };

export type TablexProps = {
  onChange?: any;
  url?: string;
  isModal?: boolean;
  columns: any;
  toggle?: any;
  bool?: boolean;
  rowKey: string;
  btnText?: string;
  toggleModal?: any;
  invoice?: boolean;
  fetchList?: boolean;
  showButton?: boolean;
  transaction?: boolean;
  setResponseLength?: any;
  PaymentRefund?: boolean;
  CreditRefund?: boolean;
  BillsPayment?: boolean;
  invoicePayment?: boolean;
  transactionData?: boolean;
  AppliedOnInvoice?: boolean;
  estimateInvoices?: boolean;
  dataFromProps?: object[];
  detailPageActive?: boolean;
  handleCreate?: (create: boolean) => void;
  from?: string;
};

export interface MainTablePropTypes<T> {
  url: string;
  columns: T[];
  loading: boolean;
  refetch: () => void;
  bulkDeleteTrue?: () => void;
  listing: { total: number; data: T[] };
  handleViewClick: (dt: ItemPropsTypes) => void;
}

export type paginateprops = {
  name: string;
  value?: any;
  url: string;
  label?: any;
  size?: SizeType;
  required?: boolean;
  defaultValue?: any;
  disabled?: boolean;
  placeholder: string;
  setTrue?: () => void;
  setFalse?: () => void;
  showButton?: boolean;
  handleAddNew?: () => void;
  paymentReceived?: boolean;
  handleChange?: any;
  setProducts?: any;
  items?: boolean;
  handleCustomerDeselect?: () => void;
  allowClear?: boolean;
  showAll?: boolean;
  report?: boolean;
  contactType?: string;
};

export type CheckBoxTypes = {
  name: string | string[];
  noStyle?: boolean;
  label?: string;
  disabled?: boolean;
  handleClick?: (key) => void;
};

export interface DataType {
  key: React.Key;
  created_at: string;
  location: string;
  description: string;
  creator: string;
}

export type CreateCustomerTypes = {
  setIsCustomerModalOpen?: any;
  isCustomerModalOpen?: any;
  setIsCustomerId?: any;
  isModal?: boolean;
};

export interface EmailProps {
  handleEmail?: () => void;
  emailUrl?: string;
  setEmail?: any;
  refetch?: () => void;
}

export interface ConfirmProps {
  text?: string;
  isModalOpen?: any;
  toggleModal?: () => void;
  handleConfirm?: () => void;
}

export type ItemDetailTableProps = {
  isModal?: boolean | any;
  details?: any;
  tableData?: any;
  expenseAccount?: boolean;
};

export type BreadcrumbxProps = {
  name: string;
  className?: string;
  setting?: boolean;
  moduleName?: string;
  category?: boolean;
  detailPage?: boolean;
  organization?: boolean;
  organizationName?: boolean;
  handleFullScreen?: any;
  show?: boolean;
  from?: string;
  refetch?: () => void;
  seconderyBtn?: any;
  toggleMapModal?: any;
};

export type SubHeaderProps = {
  title: any;
  show?: boolean;
  item?: boolean;
  btnText: string;
  account?: Boolean;
  enabled?: boolean;
  toggleModal?: any;
  navigateTo: string;
  showButton?: boolean;
  primaryBtn?: boolean;
  dropDownBtn?: boolean;
  itemdetails?: boolean;
  items?: MenuProps["items"];
  itemsMore?: MenuProps["items"];
  seconderyBtn?: boolean;
  seconderyBtnText?: string;
  toggleMapModal?: any;
};

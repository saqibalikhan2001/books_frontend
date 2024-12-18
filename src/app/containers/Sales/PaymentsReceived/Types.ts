import { MouseEvent, ChangeEvent } from "react";
import { BaseCurrecnyProps, CustomerObjProps } from "../Types";
export type Commonprops = {
  id: number;
  is_active: number;
  created_at: string;
  created_by: number;
  customer_id: number;
  currency_id: number;
  organization_id: number;
};
export type InvoiceDataSourceProps = {
  note: string;
  total: number;
  status: string;
  payment: number;
  order_no: string;
  due_date: string;
  invoice_no: string;
  payment_due: number;
  invoice_date: string;
} & Omit<Commonprops, "is_active">;
export type GetInvoiceProps = {
  adjustment: number;
  billing_address: string;
  billing_address_id: null | number;
  deleted_at: string;
  discount_level: string;
  discount_transaction_level: number;
  discount_type: string;
  display_name: string;
  estimate_id: number | null;
  invoice_term_name: string;
  invoice_term_value: string;
  original_status: string;
  payment_status: string;
  platform_type: string;
  sales_person_id: number | null;
  shipping_address: string;
  shipping_address_id: null | number;
  shipping_charge: number;
  status: string;
  sync_order: boolean;
  terms_and_condition: string;
  updated_at: string;
} & Omit<InvoiceDataSourceProps, "payment">;
export type InvoiceDetailProps = {
  advance_payment_id: number;
  deleted_at: string;
  get_invoice: GetInvoiceProps;
  invoice_id: number;
  note: string;
  payment_date: string;
  payment_made: number;
  payment_mode: string;
  payment_no: string;
  payment_type: string;
  platform_type: string;
  reference: string;
  unused_amount: number;
  updated_at: string;
} & Omit<Commonprops, "currency_id">;
export type PaymentReceivedDataSourceProps = {
  invoice_no: string | null;
  type: string;
  name: string;
  display_name: string;
  currency: BaseCurrecnyProps;
} & Omit<InvoiceDetailProps, "get_invoice">;
export type RefundDataSourceProps = {
  type: string;
  mode: string;
  note: string;
  amount: number;
  reference?: string;
  deleted_at: string;
  refund_date: string;
  updated_at: string;
  platform_type: string;
  advance_payment_id: number;
} & Omit<Commonprops, "is_active"> &
  Pick<PaymentReceivedDataSourceProps, "currency">;
export type PaymentReceivedFormProps = {
  url: string;
  contactObj?: any;
  loading?: boolean;
  UsedAmount: number;
  setContactObj?: any;
  onSubmit: (value) => void;
  invoiceData: InvoiceDataSourceProps[];
  invoicesList?: InvoiceDataSourceProps[];
  handleUsedAmount: (usedAmount: number) => void;
  handlePaymentId?: (paymentId: number | string) => void;
  handleInvoiceList: (invoices: InvoiceDataSourceProps[]) => void;
  edit?: boolean;
};
export type InvoiceListingProps = {
  setListing: any;
  customer: number;
  currency?: string;
  hasModulePermission?: any;
  listing: InvoiceDataSourceProps[];
  invoiceData: InvoiceDataSourceProps[];
  handlePayment: (e: ChangeEvent<HTMLInputElement>, row: any) => void;
  handlePayInFull: (e: MouseEvent<HTMLElement>, row: any) => void;
} & Pick<PaymentReceivedFormProps, "loading">;
export type PaymentsReceivedDetailPageProps = {
  detail?: any;
  setFalse?: any;
  isModal?: boolean;
  loading?: boolean;
  dataLength?: number;
  detailpage?: boolean;
  deleteItem?: boolean;
  refetchPaymentReceived?: () => void;
  PRdetail?: any;
  PaymentReceivedFromCustomer?: any;
  handleConfirm?: (data: RefundDataSourceProps) => void;
  handleFullScreen?: any;
};
export type PaymentFindByInvoiceFormProps = {
  handleOpenChange?: any;
  handleCustomerChange?: any;
};
export type detailprops = {
  invoice: any;
  payment: number;
  payment_made: number;
  payment_type: string;
  unused_amount: number;
  invoice_payments: object[];
  terms_and_condition: string;
  get_invoice: GetInvoiceProps;
  currency: BaseCurrecnyProps;
  customer: CustomerObjProps;
  attachments: attachmentsType[];
  is_attachment_deletable: boolean;
};
export type DetailPaymentsTabProps = {
  details: detailprops;
};
export type DetailLinkedInvoicesTab = {
  details: detailprops;
  type: string;
};
export type attachmentsType = {
  id: number;
  model: string;
  file_name: string;
  subject_id: number;
  attachment: string;
  platform_type: string;
  attachment_type: string;
  organization_id: number;
};
export type PaymentReceiveAttachements = {
  details: detailprops;
  handleImage: (e: any) => void;
  multipleDownloads: () => void;
  attachments: attachmentsType[];
  setIsBool: (state: boolean) => void;
  singleAttachmentDelete: (id: Number) => void;
};
export type PaymentReceivedListingProps = {
  form?: any;
  url?: string;
  status?: any;
  listing: any;
  pagination: any;
  contactObj?: any;
  Prev: () => void;
  Next: () => void;
  className?: string;
  loading?: boolean;
  showDetail: boolean;
  refetch: () => void;
  sidebarPosition: any;
  setContactObj?: any;
  handlePage: (val) => void;
  handleRowSize: (val) => void;
  setparam: (pagination: any) => void;
  handleViewClick: (
    dt: PaymentReceivedDataSourceProps,
    ls: PaymentReceivedDataSourceProps[]
  ) => void;
  handleFullScreen: (state: boolean) => void;
  handleClick: (dt: PaymentReceivedDataSourceProps) => void;
  setcustomLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: (values: PaymentReceivedDataSourceProps) => void;
};
export type DetailpageHeaderprops = {
  popOver: boolean;
  moduleName: string;
  navigateTo: string;
  pagination: any;
  sortPopOver: boolean;
  selectedProducts: any;
  handleOpenChange: (pop: boolean) => void;
  handleSortPopOver: (popover: boolean) => void;
} & Pick<
  PaymentReceivedListingProps,
  | "Prev"
  | "Next"
  | "refetch"
  | "listing"
  | "setparam"
  | "handlePage"
  | "form"
  | "handleRowSize"
  | "handleFullScreen"
  | "showDetail"
>;

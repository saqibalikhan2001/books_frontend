import { InvoiceDetailProps } from "../Types";

export type CreatePaymentProps = {
  url: string;
  showModal: boolean;
  refetch: () => void;
  toggleModal: () => void;
  has_permission: boolean;
  invoice_id: number | null;
  refetchInvoices: () => void;
};

export type SubmitProps = {
  payment_date: string;
};

export type PaymentListingProps = {
  url: string;
  from?: string;
  isModal?: boolean;
  loading: boolean;
  dashboardProp?:any;
  detail?: any;
  toggle: any;
  fetchList: boolean;
  showButton: boolean;
  has_permission: boolean;
  toggleModal: () => void;
  handleConfirm: (value: any) => void;
  handleConfirmCredit: (value: any) => void;
  toggleAppliedModal: () => void;
};

export type PaymentModalProps = Omit<
  CreatePaymentProps,
  "invoice_id" | "refetch" | "refetchInvoices"
> & {
  loading: boolean;
  onSubmit: (values: SubmitProps) => void;
};

export type INVPaymentProps = Pick<CreatePaymentProps, "url" | "refetchInvoices"> & {
  isModal?: boolean;
  fetchList: boolean;
  from?: string;
  dashboardProp?:any;
  refetch: () => void;
  
  detail: InvoiceDetailProps;
};
export type InvoicePaymentFormProps = Pick<CreatePaymentProps, "toggleModal" | "url"> &
  Pick<PaymentModalProps, "onSubmit"> &
  Pick<PaymentListingProps, "loading">;

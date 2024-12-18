import { BaseCurrecnyProps } from "app/containers/Sales/Types";
import { BillDetailProps } from "../Types";

export type BillPaymentDataSourceProps = {
  id: number;
  note: string;
  bill_id: number;
  is_active: number;
  reference: string;
  updated_at: string;
  created_at: string;
  created_by: number;
  currency_id: number;
  deleted_at: string;
  payment_no: number;
  payment_mode: string;
  payment_date: string;
  payment_made: number;
  platform_type: string;
  organization_id: number;
  currency: BaseCurrecnyProps;
  advance_payment_id: null | number;
};

export type SubmitProps = {
  payment_date: string;
  balance_due: number;
  saveAs: string;
};
export type CreatePaymentProps = {
  url: string;
  showModal: boolean;
  toggleModal: () => void;
  has_permission: boolean;
  bill_id: string | number;
  refetchBills: () => void;
  refetchBillPayments?: () => void;
};

export type PaymentListingProps = {
  toggle?: any;
  from?: string;
  isModal?: boolean;
  loading: boolean;
  fetchList: boolean;
  showButton: boolean;
  toggleModal: () => void;
  hasViewPermission: boolean;
  handleConfirm: (value: BillPaymentDataSourceProps) => void;
} & Pick<CreatePaymentProps, "url" | "has_permission">;

export type paymentModalProps = Omit<
  CreatePaymentProps,
  "bill_id" | "refetchBillPayments" | "refetchBills"
> & {
  loading: boolean;
  onSubmit: (values: any) => void;
};

export type BillPaymentProps = Pick<CreatePaymentProps, "url" | "refetchBills"> & {
  isModal?: boolean;
  from?: string;
  fetchList: boolean;
  detail: BillDetailProps;
  refetchBillPayments: () => void;
};

export type BillPaymentFormProps = Pick<CreatePaymentProps, "url" | "toggleModal" | "showModal"> &
  Pick<paymentModalProps, "onSubmit" | "loading">;

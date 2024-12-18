// import { PaymentReceivedDetailProps, RefundDataSourceProps } from "../Types";

import { RefundDataSourceProps } from "../PaymentsReceived/Types";

export type RefundDSProps = RefundDataSourceProps;

export type RefundOnSubmitProps = {
  refund_date: string;
  refund_credits?: any;
  refund_mode?: any;
};

export type RefundModalProps = {
  url: string;
  PRdetail: any;
  loading: boolean;
  showModal: boolean;
  toggleModal: () => void;
  has_permission: boolean;
  handleType?: (type: string) => void;
  moduleendpoint?: any;
  onSubmit: (values: RefundOnSubmitProps) => void;
};

export type RefundListingProps = {
  toggle?: any;
  PRdetail: any;
  toggleFetch?: any;
  isModal?: boolean;
  fetchList: boolean;
  PaymentRefund?: boolean;
  toggleModal: () => void;
  handleConfirm: (dt: RefundDSProps) => void;
} & Pick<RefundModalProps, "loading" | "url" | "has_permission">;

export type PRRefundsProps = {
  refetchRefund: () => void;
  refetchPaymentReceived: () => void;
  PRdetail: any;
} & Pick<RefundListingProps, "fetchList" | "url">;

export type CreateRefundProps = Omit<PRRefundsProps, "fetchList"> &
  Pick<RefundModalProps, "showModal" | "toggleModal" | "has_permission"> &
  Pick<RefundListingProps, "PaymentRefund" | "toggleFetch">;

export type RefundFormProps = Omit<RefundModalProps, "showModal" | "has_permission">;

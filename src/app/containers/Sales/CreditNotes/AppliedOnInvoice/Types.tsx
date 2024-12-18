export type AppliedInvoiceProps = {
  url: string;
  isModal?: boolean;
  detail: any;
  from?: string;
  fetchList: boolean;
  refetchApplied: () => void;
  refetchPaymentReceived: any;
};

export type AppliedListingProps = {
  detail: any;
  loading?: boolean;
  isModal?: boolean;
  from?: string;
  toggle?: any;
  handleConfirm?: any;
  toggleModal?: () => void;
  has_permission?: boolean;
} & Pick<AppliedInvoiceProps, "url" | "fetchList">;

export type CreateInvoiceAppliedProps = {
  showModal: boolean;
  toggleModal: () => void;
  has_permission: boolean;
} & Pick<AppliedInvoiceProps, "refetchPaymentReceived" | "refetchApplied" | "detail">;

export type AppliedModalProps = {
  showModal?: boolean;
  onSubmit: (values) => void;
} & Pick<AppliedListingProps, "url" | "loading" | "has_permission" | "toggleModal">;

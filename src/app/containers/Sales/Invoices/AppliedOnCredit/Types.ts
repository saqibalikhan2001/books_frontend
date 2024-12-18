export type AppliedInvoiceProps = {
    url: string;
    detail: any;
    fetchList: boolean;
    refetchApplied: () => void;
    refetchPaymentReceived: any;
  };
  
  export type AppliedListingProps = {
    detail: any;
    loading?: boolean;
    isModal?: boolean;
    toggle?: any;
    handleConfirm?: any;
    toggleModal?: () => void;
    has_permission?: boolean;
  } & Pick<AppliedInvoiceProps, "url" | "fetchList">;
  
  export type CreateInvoiceAppliedProps = {
    invoice?:boolean;
    showModal: boolean;
    toggleModal: () => void;
    has_permission: boolean;
  } & Pick<AppliedInvoiceProps, "refetchPaymentReceived" | "refetchApplied" | "detail">;
  
  export type AppliedModalProps = {
    showModal?: boolean;
    onSubmit: (values) => void;
  } & Pick<AppliedListingProps, "url" | "loading" | "has_permission" | "toggleModal">;
  
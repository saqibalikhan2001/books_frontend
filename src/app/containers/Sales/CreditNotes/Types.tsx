export type CreditNoteDetailProps = {
  data?: any;
  detail: any;
  setparam?: any;
  setFalse?: any;
  from?: string;
  detailpage?: boolean;
  isModal?: boolean;
  loading?: boolean;
  handleConfirm?: any;
  refetch?: () => void;
  handleFullScreen?: any;
};

export type CreditItemTableProps = { setDetails: any; isModal?: boolean } & Pick<
  CreditNoteDetailProps,
  "detail"
>;
export type CreditNoteInvoiceProps = Pick<CreditNoteDetailProps, "detail">;
export type CreditNoteHistoryProps = { isModal?: boolean } & Pick<CreditNoteDetailProps, "detail">;
export type CreditNoteModalProps = {
  creditId?: Number;
  creditNotesData?: any;
  creditModal?: Boolean;
  refetchCreditNotes?: any;
  toggleCreditNoteModal?: any;
  refetchInvoices?: any;
  className?:string,
  setCreditId: React.Dispatch<any>;
  // refetchCreditNotes?: (() => void) | any;
} & Pick<CreditNoteAttachmentsProps, "details">;

export type CreditNoteAttachmentsProps = {
  details: any;
  attachments: any;
  handleImage: (e: any) => void;
  multipleDownloads: () => void;
  singleAttachmentDelete: (id: any) => void;
};

export type ItemDetailTableProps = {
  isModal?: boolean;
  tableData?: any;
} & Pick<CreditNoteAttachmentsProps, "details">;

export type CreditNoteDetailPageProps = {
  isModal: boolean;
  creditNotesData: any;
  refetchInvoices?: () => void;
  className?:string
} & Pick<CreditNoteModalProps, "details" | "refetchCreditNotes">;

export type CreateCreditNoteProps = {
  isModal?: Boolean;
  invoiceDetail?: any;
  refetchInvoices?: any;
  handleTabChange?: (key) => void;
} & Pick<CreditNoteModalProps, "refetchCreditNotes" | "creditModal" | "toggleCreditNoteModal">;

export type CreditNoteFormProps = {
  url: string;
  Edit?: boolean;
  items?: any;
  loading: boolean;
  create?: boolean;
  isModal?: Boolean;
  setCreditId?: any;
  data: {
    deductions: number;
    issuedCredits: number;
  };
  setContactObj: any;
  contactObj: any;
  setInvoiceId?: any;
  onSubmit: (values) => void;
  toggleCreditNoteModal?: any;
  creditModal?: boolean | any;
  setData?: React.Dispatch<any>;
  handleItemList: (items) => void;
  customerFromCustomer?: any;
} & Pick<CreditNoteDetailProps, "detail">;

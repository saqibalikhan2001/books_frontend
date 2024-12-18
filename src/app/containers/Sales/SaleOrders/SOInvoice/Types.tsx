import { SODetailProps, SOItemObjProps } from "../Types";

export type SOInvoiceItemObjProps = SOItemObjProps;

export type InvoiceDetailProps = {
  id?: number;
};
export type EditInvoiceProps = Omit<CreateInvoiceProps, "url"> & {
  InvoiceDetail: InvoiceDetailProps;
};

export type SOInvoiceSubmitProps = { due_date: string; invoice_date: string };

export type CreateInvoiceProps = {
  url: string;
  bool: boolean;
  refetchSO: () => void;
  toggleModal: () => void;
  has_permission: boolean;
  SOdetails: SODetailProps;
  refetchInvoices: () => void;
};

export type InvoiceModalProps = {
  item?:any
  edit?: boolean;
  contactObj: any;
  loading: boolean;
  setContactObj: any;
  showModal: boolean;
  onSubmit: (values: any) => void;
  handleTotal: (total: number) => void;
  handleItemList: (items: any) => void;
} & Pick<CreateInvoiceProps, "SOdetails" | "toggleModal" | "url" | "has_permission">;

export type InvoiceListingProps = {
  fetchList: boolean;
  toggleModal: () => void;
  hasViewPermission: boolean;
  handleCreate: (create: boolean) => void;
  handleClick: (dt: InvoiceDetailProps) => void;
  handleConfirm: (dt: InvoiceDetailProps) => void;
} & Pick<InvoiceModalProps, "url" | "has_permission" | "loading">;

export type SoInvoiceProps = Pick<InvoiceListingProps, "fetchList"> &
  Omit<CreateInvoiceProps, "toggleModal" | "bool" | "has_permission">;

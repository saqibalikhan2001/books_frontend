import { MouseEventHandler, ReactNode } from "react";
import { FormInstance, Rule } from "antd/es/form";
import type { UploadFile } from "antd/es/upload/interface";
import { BaseCurrecnyProps } from "../Types";
import { CustomerDataSource } from "store/query/Types";

export type CtxInputProps = {
  name: string;
  rules?: Rule[];
  placeholder: string;
  form?: FormInstance;
  label: string | ReactNode;
};
export type BillingAddressProps = {
  edit?: boolean;
  isModal?: boolean;
  form?: FormInstance;
  customerForm?: boolean;
  contactForm?: boolean;
};

export type CustomerTabProps = {
  url: string;
  edit?: boolean;
  clone?: boolean;
  isModal?: boolean;
  create?: boolean;
  loading: boolean;
  setCurrency?: any;
  attachList?: any;
  handleFileList?: any;
  setFileList?: any;
  setCurrentIndex?: any;
  fileList?: any;
  currentIndex?: any;
  supplier?: boolean;
  setAttachList?: any;
  deleteAttachments?: any;
  setDeleteAttachments?: any;
  handleImageAttachList?: any;
  onSubmit: (values) => void;
  isCustomerModalOpen?: boolean;
  setIsCustomerModalOpen?: (open: boolean) => void;
  handleCurrenyId?: (id: number | string) => void;
  setCustomerOptions?: any;
};

export type CustomerFormProps = {
  isModal?: boolean;
  firstNameRef?: any;
  supplier?: boolean;
  base_currency?: any;
  displayNameRef?: any;
  form?: FormInstance;
  display_names?: any;
};

export type CustomerDetailPropTypes = {
  id: number;
  email: string;
  skype: string;
  mobile: string;
  twitter: string;
  facebook: string;
  last_name: string;
  instagram: string;
  first_name: string;
  created_at: string;
  updated_at: string;
  work_phone: string;
  salutation: string;
  display_name: string;
  contact_type: string;
  currencyName: string;
  platform_type: string;
  mobile_secondary: string;
  company_name: string | null;
  work_phone_secondary: string;
};
export interface CustomerListingProps {
  status: any;
  loader: any;
  listing: any;
  products: any;
  setparam: any;
  setLoader: any;
  supplier?: any;
  setEmail?: any;
  pagination: any;
  setProducts: any;
  externalClass?: any;
  next: () => void;
  loading: boolean;
  showDetail: boolean;
  refetch: () => void;
  sidebarPosition?: any;
  setEmailLoading?: any;
  setcustomLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: MouseEventHandler;
  handleConfirm: (id: number) => void;
  handleFullScreen: (state: boolean) => void;
  handleViewClick: (dt: CustomerDataSource, listing: CustomerDataSource[]) => void;
}

export type CustomerDetailPageProps = {
  isModal?: boolean;
  loading?: boolean;
  supplier?: boolean;
  dataLength?: number;
  deleteItem?: boolean;
  setFalse?: (bool) => void;
  detail: { id: number };
  handleFullScreen?: (state: boolean) => void;
  handleConfirm?: (data: any) => void;
  customer_id?: number;
  refetch?: any;
  detailpage?: boolean;
  email?: any;
  setEmail?: any;
  emailLoading?: any;
  setEmailLoading?: any;
};

export type TransactionSummaryProps = {
  total_payable: number | null;
  total_receivable: number | null;
  total_to_be_packed: number | null;
  total_to_be_shipped: number | null;
  total_to_be_invoiced: number | null;
};

export type AddressDetailsProps = {
  id: number;
  is_active: number;
  attention: string;
  contact_id: number;
  created_by: number;
  created_at: string;
  fax: string | null;
  updated_at: string;
  city: string | null;
  phone: string | null;
  state: string | null;
  street: string | null;
  organization_id: number;
  zip_code: string | null;
  country_id: number | null;
  deleted_at: string | null;
  country_name: string | null;
  address_type: string | null;
  platform_type: string | null;
};

export type ContactDetailsProps = {
  email: string | null;
  department: string | null;
  designation: string | null;
  first_name: string;
  last_name: string | null;
  mobile: string | null;
  salutation: string | null;
  skype: string | null;
  work_phone: string | null;
} & Pick<
  AddressDetailsProps,
  | "contact_id"
  | "created_at"
  | "created_by"
  | "deleted_at"
  | "id"
  | "organization_id"
  | "platform_type"
  | "updated_at"
>;

export type DetailsProps = {
  id: number;
  ct_address: any;
  has_transaction: any;
  ct_person: any;
  photo: string;
  note: string;
  is_active?: number;
  over_due: number;
  license_no: string;
  display_name: string;
  contact_type: string;
  platform_type: string | null;
  unused_credits: number | null;
  currency: BaseCurrecnyProps;
  contact_persons: ContactDetailsProps[];
  contact_addresses: AddressDetailsProps[];
  transaction_summary: TransactionSummaryProps;
};

export type OverviewProps = {
  url: string;
  details: DetailsProps;
  setDetails: (dt: DetailsProps) => void;
  // handleClick: MouseEventHandler;
  // handleConfirm: (id: number) => void;
};

export type StatementProps = {
  statement?: [];
  url?: string;
  setEmail?: any;
  name?: string;
  setIsDate?: any;
  isModal?: boolean;
  supplier?: boolean;
  setUploading?: any;
  totalDue?: number | null;
  totalPaid?: number | null;
  creditSales?: number | null;
  totalAmount?: number | null;
  creditNotes?: number | null;
  creditNetSales?: number | null;
  openingBalance?: number | null;
  base_currency?: BaseCurrecnyProps;
};

export type TransactionsProps = {
  url: string;
  contact_type: string;
  className?: string;
};

export type AddAddressProps = {
  bool: boolean;
  modalOpen: boolean;
  current?: {
    contact_address: AddressDetailsProps;
  };
  handleModal: () => void;
  handleClose?: () => void;
  onSubmit: (values) => void;
};

export type EditAddressProps = {
  url: string;
  detail: {
    contact_addresses: AddressDetailsProps[];
  };
  current: {
    id?: number;
  };
  toggle: () => void;
  setDetails: (dt: any) => void;
} & Pick<AddAddressProps, "modalOpen" | "handleModal" | "bool">;

export type AddPersonProps = {
  current?: ContactDetailsProps;
} & Pick<AddAddressProps, "bool" | "onSubmit" | "modalOpen" | "handleModal" | "handleClose">;

export type EditPersonProps = {
  bool: boolean;
  detail: {
    contact_persons: ContactDetailsProps[];
  };
} & Omit<EditAddressProps, "detail">;

export type Upload_Images = {
  originFileObj: UploadFile;
};

import { ValuesProps } from "app/containers/Sales/Types";

export type PoReceiveProps = {
  url: string;
  detail: any;
};
export type CreateReceiveProps = {
  url: string;
  bool: boolean;
  PODetails: any;
  refetch: () => void;
  closeModal: () => void;
  has_permission: boolean;
};
export type ReceiveListingProps = {
  loading: boolean;
  listing: Object[];
  has_permission: boolean;
  handleConfirm: (id: number) => void;
};
export type ReceiveModalProps = {
  url: string;
  showModal: boolean;
  loading: boolean;
  closeModal: () => void;
  has_permission: boolean;
  onSubmit: (values: any) => void;
  handleItemList?: (items: any) => void;
};
export type ReceiveFormProps = {
  url: string;
  loading: boolean;
  isModal: boolean;
  close: () => void;
  handleItemList: any;
  onSubmit: (values: ValuesProps) => void;
};
export type ItemTableProps = {
  listing: Object[];
  handleConfirm: (values: any) => void;
  handleQuantityChange: (value: number | null, row: any) => void;
};

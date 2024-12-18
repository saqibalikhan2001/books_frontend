import { MouseEventHandler } from "react";
export type AccountFormProps = {
  url: string;
  account?: any;
  bool: boolean;
  edit?: boolean;
  loading: boolean;
  isItemForm?: boolean;
  setEditAccount?: any;
  has_permission: boolean;
  toggle: (x?: any, y?: any) => void;
  onSubmit: (values: AccountSubmitProps) => void;
  from?: string;
};
export type AccountNameFormProps = {
  onSubmit: (values: AccountNameSubmitProps) => void;
} & Omit<AccountFormProps, "onSubmit">;
export type CreateAccountProps = Omit<AccountFormProps, "onSubmit" | "loading" | "url"> & {
  refetch?: () => void;
  query?: string;
  isItemForm?: boolean;
};
export type AcccountProps = {
  id: number;
  title: string;
  deletable: number;
  is_active: number;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  created_by: number;
  platform_type: string;
  current_balance: number;
  opening_balance: number;
  organization_id: number;
  account_group_id: number;
};
export type AccountDataSourceProps = {
  id: number;
  name: string;
  type: string;
  is_active: number;
  created_at: string;
  created_by: number;
  deleted_at: string;
  updated_at: string;
  platform_type: string;
  accounts: AcccountProps;
  organization_id: number;
  deletable: number | null;
};
export type AccountListingProps = {
  total?: number | undefined;
  handleConfirm: MouseEventHandler;
  listing: AccountDataSourceProps[];
} & Pick<AccountFormProps, "loading" | "has_permission">;
export type AccountGroupProps = {} & Omit<
  AcccountProps,
  "title" | "current_balance" | "opening_balance" | "account_group_id"
>;
export type AccoutNameDataSourceProps = {
  title: string;
  account_group: AccountGroupProps;
} & Omit<AccountDataSourceProps, "accounts">;
export type AccountNameListingProps = {
  listing: AccoutNameDataSourceProps[];
} & Omit<AccountListingProps, "listing">;
export type AccountSubmitProps = {
  currency: any;
  account_type: string;
  tax_id: any;
  account_type_id?: any;
  account_subtype_id?: any;
  account_group_name: string;
  balance: { sign: string; value: string };
};
export type data = {
  id: number;
  name: string;
};
export type AccountNameSubmitProps = {
  account_title: string;
  opening_balance: string;
  current_balance: string;
  account_group_id: string;
};

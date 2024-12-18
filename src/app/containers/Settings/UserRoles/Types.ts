/**@format */

// import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { DefaultState } from "./Role/Reducer";
export type RoleFormProps = {
  current?: any;
  bool?: boolean;
  loading: boolean;
  roleAlert: boolean;
  toggle?: () => void;
  onSubmit: (val: any) => void;
  itemPermissions: DefaultState;
  setAlert: Dispatch<SetStateAction<boolean>>;
  dispatch: Dispatch<{
    type: string;
    payload: CheckboxValueType[];
  }>;
  has_permission: boolean;
};

export type RoleCreateProps = Omit<RoleFormProps, "current" | "loading" | "onSubmit"> & {
  refetch: () => void;
};

export type RoleEditProps = Required<RoleCreateProps> & Pick<RoleFormProps, "current">;

// export type roleDetailProps = Pick<RoleFormProps, "bool" | "toggle">;
export type roleDetailProps = Pick<
  inviteUserDetailProps,
  "data" | "refetch" | "isLoading" | "isFetching" | "onChange"
>;

export type roleListingProps = {
  total?: number | undefined;
  loading?: boolean;
  list: object[];
  onChange: any;
  handleClick: MouseEventHandler;
  handleConfirm: MouseEventHandler;
} & Pick<RoleFormProps, "has_permission">;

export type RoleCheckboxFormProps = {
  title: string;
  list: string[];
  is_sales_person: boolean;
  itemPermissions: CheckboxValueType[];
  setSales: Dispatch<SetStateAction<boolean>>;
  dispatch: Dispatch<{ type: string; payload: CheckboxValueType[] }>;
  // setPermission: Dispatch<SetStateAction<CheckboxValueType[]>>;
};

export type submitCreateUserProps = {
  name: string;
  email: string;
  role_id: string | number;
};

export type InviteUserModalProps = {
  url: string;
  bool: boolean;
  isEdit?: boolean;
  loading: boolean;
  toggle: () => void;
  onSubmit: (val: any) => void;
  has_permission: boolean;
};
export type EditInviteUserFormProps = Pick<
  InviteUserModalProps,
  "url" | "bool" | "toggle" | "has_permission"
> & {
  current: any;
  refetch: () => void;
};

export type CreateInviteUserProps = Omit<EditInviteUserFormProps, "current">;

export type inviteUserDetailProps = {
  data: object[];
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
  onChange: any;
} & Pick<InviteUserModalProps, "bool" | "toggle">;

export type inviteUserListingProps = { onChange: any; refetch: () => void } & Required<
  Omit<roleListingProps, "total">
>;

export type RoleSubmitProps = Pick<submitCreateUserProps, "name"> & {
  slug: any;
  sales_person: boolean;
};

export type UsersListingProps = {
  list: object[];
  total?: number;
  loading: boolean;
  has_permission: boolean;
  handleClick: MouseEventHandler;
  handleConfirm: (id: number) => void;
};

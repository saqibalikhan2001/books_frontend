import { Dispatch, SetStateAction } from "react";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { FormInstance } from "antd";

export type Tokens = {
  access_token: string;
  organization_id: string | number;
};

export type BusinessTypeDetails = {
  id: number;
  name: string;
  form: string;
  slug: string;
  is_active: number;
  description: string;
};

export type OrganizationUtilities = {
  isLoading: boolean;
  org_list: object[];
  ctry_list: object[];
  fiscle_list: string[];
  currncy_list: object[];
  business_type: BusinessTypeDetails[];
};

export type RegisterFormProps = {
  current: any;
  edit?: boolean;
  loading: boolean;
  prev: () => void;
  onSubmit: (val: any) => void;
  getGlobalCurrencyId: (id) => void;
};

export type BusinessInfoProps = {
  show: boolean;
} & Omit<OrganizationUtilities, "ctry_list">;

export type ContactInfoProps = Pick<OrganizationUtilities, "ctry_list" | "isLoading"> & {
  form?: any;
};

export type MenuListProps = {
  // isLoading: boolean;
  cacheToggle: () => void;
  openInnerDrawer: (item: any) => void;
};

export type RegisterOrganizationProps = Pick<RegisterFormProps, "edit"> & {
  curr?: any;
  refetch?: () => void;
  toggleModel?: () => void;
};

export type OrganizationListingProps = {
  item: any;
  organization_id: string | number;
  handleClick: (org: number) => void;
  handleSwitchClick: (org: number) => void;
  handleEditClick: (org: number) => void;
  getCurrentSharedOrg: (org: any) => void;
};

export type RegisterSubmitProps = {
  logo: any;
  number_type: any;
  time_zone: string;
  base_currency_id: any;
  fiscal_year_id: string;
  primary_contact_name: string;
  organization_type_id: string;
  inventory_start_date: string;
  primary_contact_email: string;
};

export type ImsOrgProps = {
  sharedOrg?: any;
  shared?: boolean;
  isModal?: boolean;
  refetch?: () => void;
  closeModal?: () => void;
};

export type SharedOrgFormProps = {
  share: boolean;
  setOrdid: Number;
  modules: object[];
  organizations: object[];
  handlesubmit: () => void;
  setModule: CheckboxValueType[];
};

export type BusinessTypeProps = Pick<
  OrganizationUtilities,
  "isLoading" | "org_list" | "business_type"
> & {
  option: string;
  setOption: Dispatch<SetStateAction<string>>;
  form: FormInstance;
};

export type ContactStepProps = Pick<OrganizationUtilities, "isLoading" | "ctry_list"> & {
  step: number;
  form?: any;
};

export type BusinessStepTwoProps = Pick<
  OrganizationUtilities,
  "isLoading" | "currncy_list" | "fiscle_list"
> & {
  show: boolean;
};

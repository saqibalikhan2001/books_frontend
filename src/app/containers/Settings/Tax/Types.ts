import { Dispatch, MouseEventHandler, SetStateAction } from "react";

export type TaxGroupDetailsProps = {
  id: number;
  tax_id: number;
  created_at: string;
  updated_at: string;
  tax_group_id: number;
  platform_type: string;
  deleted_at: null | number;
};
export type TaxCurrentProps = {
  id: number;
  name: string;
  tax_group_details: TaxGroupDetailsProps[];
};
export type TaxFormProps = {
  bool: boolean;
  taxObj?: any;
  loading: boolean;
  toggle: () => void;
  refetch?: () => void;
  has_permission: boolean;
  current?: TaxCurrentProps;
  onSubmit: (values) => void;
  setTaxObj?: Dispatch<SetStateAction<{}>>;
  setCurrent?: Dispatch<SetStateAction<{}>>;
};

export type ModalProps = Omit<TaxFormProps, "refetch">;

export type CreateTaxProps = Omit<TaxFormProps, "onSubmit" | "loading" | "setCurrent"> & {
  setTaxList?: any;
};
export type EditTaxProps = Omit<TaxFormProps, "onSubmit" | "loading">;

export type TaxDataSource = {
  id: number;
  name: string;
  rate: number;
  label: string;
  sortorder: number;
  authority: string;
  deletable: number;
  updated_at: string;
  created_by: number;
  created_at: string;
  is_compound: number;
  platform_type: string;
  organization_id: number;
  deleted_at: null | string;
}[];

export type TaxListingProps = {
  total: number | undefined;
  listing: TaxDataSource[];
  handleClick: MouseEventHandler;
  handleConfirm: MouseEventHandler;
} & Pick<TaxFormProps, "loading" | "has_permission">;

export type TaxSubmitProps = {
  name: string;
  authority: string;
  is_compound: boolean;
  rate: string | number;
};

export type TaxGroupFormProps = Omit<TaxFormProps, "refetch"> & {
  listing: TaxDataSource[];
  currSelected: number[];
  setCurrent?: Dispatch<SetStateAction<{}>>;
  setSelected?: Dispatch<SetStateAction<TaxDataSource[]>>;
  setCurrSelected: Dispatch<SetStateAction<number[]>>;
};

export type TaxGroupEditProps = Omit<TaxGroupFormProps, "loading" | "onSubmit"> &
  Pick<TaxFormProps, "refetch" | "has_permission">;

export type CreateTaxGroupFormProps = {
  listing: TaxDataSource[];
  currSelected: number[];
  setCurrSelected: Dispatch<SetStateAction<number[]>>;
} & Omit<TaxFormProps, "onSubmit" | "loading">;

export type GroupModalProps = TaxGroupFormProps & Pick<TaxFormProps, "has_permission">;

export type TaxGroupSubmitProps = {
  _ids: Dispatch<SetStateAction<never[]>>;
} & GroupModalProps;

export type TaxTabsProps = {
  current: string;
  handleChange: (curr: string) => void;
};
export type TaxGroupListProps = {
  data: TaxDataSource[];
  setSelected: any;
  currSelected: number[];
} & Pick<TaxGroupFormProps, "setCurrSelected">;

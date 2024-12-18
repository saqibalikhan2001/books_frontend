import { FormInstance } from "antd";

export interface CategoriesType {
  name: String;
  key: React.Key;
  products: string;
}
export interface CategoriesListProps {
  data: any;
  bool: boolean;
  pagination: any;
  Prev: () => void;
  Next: () => void;
  isLoading: boolean;
  handlePage: (val) => void;
  handleConfirm: (val) => void;
  handleRowSize: (val) => void;
  onChange: (pg, so, fi) => void;
  handleClick: (value: number) => void;
}

export interface CategoriesSubmit {
  id: number;
  name: String;
  description: String;
  category_owner: boolean;
}

export interface CategoriesFunctions {
  edit?: boolean;
  boolean?: boolean;
  formLoading?: boolean;
  loading?: boolean;
  form: FormInstance;
  setIsModalOpen?: any;
  isFetching?: boolean;
  handleCancel?: () => void;
  current?: CategoriesSubmit;
  userData?: (values: object) => void;
  onSubmit?: (values: CategoriesSubmit) => void;
}

export type ModalFunctions = Omit<CategoriesFunctions, "form"> & {
  edit?: boolean;
  toggle?: () => void;
  isModalOpen?: boolean;
  modalData?: any;
  formLoading?: boolean;
};
export type createCategoriesProps = Pick<
  CategoriesFunctions,
  "current" | "userData" | "isFetching" | "setIsModalOpen"
> & {
  itemform?: boolean;
  refetch: () => void;
  isModalOpen?: boolean;
  handleCategory?: (values?: any) => void;
};

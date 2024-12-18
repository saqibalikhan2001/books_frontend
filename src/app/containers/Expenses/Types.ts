import { FormInstance } from "antd";
import { ExpenseSourceData } from "store/query/Types";

export type Commonprops = {
  id: number;
  is_active: number;
  created_at: string;
  created_by: number;
  customer_id: number;
  currency_id: number;
  organization_id: number;
};

export type ExpenseDataSourceProps = {
  type: string;
  name: string;
  display_name: string;
  platform_type: string;
  invoice_no: string | null;
};

export type ExpenseFormProps = {
  url: string;
  loading?: boolean;
  onSubmit?: (values) => void;
};

export type ExpenseListingProps = {
  loading: boolean;
  showDetail: boolean;
  refetch: () => void;
  bulkDeleteTrue: () => void;
  listing: ExpenseSourceData;
  handleClick: (dt: ExpenseDataSourceProps) => void;
  handleConfirm: (values: ExpenseDataSourceProps) => void;
  handleViewClick: (dt: ExpenseDataSourceProps, ls: ExpenseDataSourceProps[]) => void;
};

export type BulkExpenseFormProps = {
  loading: boolean;
  createFormData: any;
  onSubmit: (values) => void;
};

export type ExpenseDetailProps = {
  form: FormInstance;
  categories?: object[];
  tags: object[] | undefined;
  taxes: object[] | undefined;
};

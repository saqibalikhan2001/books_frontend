export type PaymentMethodDataSourceProps = {
  id: number;
  name: string;
  value: string;
  deletable: number;
  is_active: number;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  created_by: number;
  platform_type: string;
  organization_id: number;
};

export type PaymentMethodDetailProps = Omit<PaymentMethodDataSourceProps, "value">;
export type PaymentMethodFormProps = {
  bool: boolean;
  loading: boolean;
  toggle: () => void;
  has_permission: boolean;
  current?: PaymentMethodDetailProps;
  onSubmit: (values: PaymentMethodSubmitProps) => void;
};

export type CreatePaymentMethodProps = Omit<PaymentMethodFormProps, "onSubmit" | "loading"> & {
  refetch: () => void;
  memoizehandleCreate: (create: boolean) => void;
};

export type PaymentMethodListingProps = {
  total?: number;
  listing: PaymentMethodDataSourceProps[];
  handleClick: (dt: PaymentMethodDataSourceProps) => void;
  handleConfirm: (dt: PaymentMethodDataSourceProps) => void;
} & Pick<PaymentMethodFormProps, "loading"> &
  Pick<PaymentMethodFormProps, "has_permission">;

export type EditPaymentMethodprops = {
  bool: boolean;
  toggle: () => void;
  refetch: () => void;
  paymentMethod: PaymentMethodDetailProps;
} & Pick<PaymentMethodFormProps, "has_permission">;

export type PaymentMethodSubmitProps = {
  name: string;
};

export type ModalProps = {
  visible: boolean;
  has_permission: boolean;
} & Pick<PaymentMethodFormProps, "onSubmit" | "toggle" | "loading" | "current">;

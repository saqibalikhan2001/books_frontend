export type WarehouseFormProps = {
  current?: any;
  bool: boolean;
  loading: boolean;
  ctry_list: object[];
  has_permission: boolean;
  toggle: (id?: any) => void;
  onSubmit: (values: any) => void;
};

export type WrCreateProps = { refetch: () => void } & Pick<
  WarehouseFormProps,
  "ctry_list" | "has_permission"
>;
export type WrEditProps = Pick<WrCreateProps, "refetch" | "has_permission"> &
  Omit<WarehouseFormProps, "onSubmit" | "loading">;
export type WrListingProps = { warehouses: object[] } & Pick<
  WrEditProps,
  "toggle" | "refetch" | "has_permission"
>;

import { MouseEventHandler } from "react";

export type CurrencyCommonProps = {
  loading?: boolean;
  toggle: () => void;
  refetch: () => void;
  currncy_list: object[];
  has_permission: boolean;
};

export type CreateCurrencyProps = Omit<CurrencyCommonProps, "toggle">;
export type EditCurrencyProps = {
  current: any;
  bool: boolean;
} & CurrencyCommonProps;

export type CurrencyDataSource = {
  id: number;
  created_by: number;
  name: string | null;
  exchange_rate: number;
  symbol: string | null;
  organization_id: number;
  updated_at: string | null;
  deleted_at: string | null;
  created_at: string | null;
  platform_type: string | null;
  currency_code: string | null;
  basic_currency_status: boolean;
};

export type CurrencyListingProps = {
  total: number | undefined;
  listing: CurrencyDataSource[];
  handleClick: MouseEventHandler;
  handleConfirm: MouseEventHandler | ((id: number) => void);
} & Pick<CurrencyCommonProps, "loading" | "has_permission">;

export type CurrencySubmitProps = {
  name: string;
  symbol: string;
  currency_code: string | number;
  exchange_rate: string | number;
};

export type CurrencyFormProps = Pick<
  CurrencyCommonProps,
  "loading" | "currncy_list" | "toggle" | "has_permission"
> & {
  current?: any;
  bool: boolean;
  onSubmit: (values: CurrencySubmitProps) => void;
};

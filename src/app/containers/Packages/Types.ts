import { MouseEventHandler } from "react";

export type SubmitProps = {
  package_date: string;
};
export type PackageFromProps = {
  url?: string;
  edit?: boolean;
  loading: boolean;
  isModal?: boolean;
  close?: () => void;
  SOId?: number | string;
  handleItemsList: (items: any) => void;
  onSubmit: (values: SubmitProps) => void;
};
export type DetailPageProps = {
  detail: { id: number };
  handleFullScreen: (state: boolean) => void;
};

export type PackageListingProps = {
  total?: number;
  loading: boolean;
  listing: object[];
  showDetail: boolean;
  handleViewClick: any;
  handleClick: MouseEventHandler;
  handleConfirm: (id: number) => void;
};

export type SubTableProps = {
  data: object[];
  items: any;
  loader: boolean;
  isModal: boolean;
  warehouses: object[];
  handleConfirm: (values: any) => void;
  handleSelectedItem: (option: number, row: any) => void;
  handleQuantityChange: (value: number | null, row: any) => void;
};

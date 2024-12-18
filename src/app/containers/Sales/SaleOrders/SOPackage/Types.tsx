import { Dispatch, MouseEventHandler } from "react";

export type CreatePackageProps = {
  url: string;
  bool: boolean;
  refetch: () => void;
  toggleModal: () => void;
  has_permission: boolean;
  SODetails: Dispatch<React.SetStateAction<object[]>>;
};
export type EditPackageProps = Omit<CreatePackageProps, "url"> & {
  pkgDetail: any;
};

export type PackageModalProps = {
  url: string;
  edit?: boolean;
  SOdetails: any;
  loading: boolean;
  showModal: boolean;
  toggleModal: () => void;
  has_permission: boolean;
  onSubmit: (values: any) => void;
  handleItemsList: (items: any) => void;
};

export type PackageListingProps = {
  loading: boolean;
  listing: Object[];
  has_permission: boolean;
  handleClick: MouseEventHandler;
  handleConfirm: (id: number) => void;
  // handleShipment: any;
};

export type SoPackageProps = {
  url: string;
  detail: any;
};

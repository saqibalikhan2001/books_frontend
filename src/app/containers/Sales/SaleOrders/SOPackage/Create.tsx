/**@format */

import { useCallback, useState } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import PackageModal from "./Modal";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime } from "utils";
import { CreatePackageProps } from "./Types";
import { SubmitProps } from "app/containers/Packages/Types";

const { PACKAGES } = endpoints;

export const CreatePackage = ({
  url,
  bool,
  refetch,
  SODetails,
  toggleModal,
  has_permission,
}: CreatePackageProps) => {
  const [itemsList, setItemsList] = useState([]);
  const { callAxios, toggle: loader, bool: loading } = useAxios();

  const handleItemsList = useCallback((items: any) => setItemsList(items), []);

  const onSubmit = (values: SubmitProps) => {
    loader();
    callAxios({
      method: "post",
      url: PACKAGES,
      data: { ...values, items: itemsList, package_date: getFullDateAndTime(values.package_date) },
    }).then((res: any) => {
      loader();
      if (res) {
        Toast({ message: res.message });
        toggleModal();
        refetch();
      }
    });
  };
  return (
    <>
      <PackageModal
        url={url}
        showModal={bool}
        loading={loading}
        onSubmit={onSubmit}
        SOdetails={SODetails}
        toggleModal={toggleModal}
        has_permission={has_permission}
        handleItemsList={handleItemsList}
      />
    </>
  );
};

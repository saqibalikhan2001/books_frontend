/** @format */
import { useCallback, useState } from "react";
import { Toast } from "app/shared";
import { endpoints } from "static";
import PackageModal from "./Modal";
import { getFullDateAndTime } from "utils";
import { EditPackageProps } from "./Types";
import { useAxios, useBool } from "app/Hooks";
import { SubmitProps } from "app/containers/Packages/Types";

const { PACKAGES } = endpoints;

export const EditPackage = ({
  bool,
  refetch,
  SODetails,
  pkgDetail,
  toggleModal,
  has_permission,
}: EditPackageProps) => {
  const { callAxios } = useAxios();
  const [itemsList, setItemsList] = useState([]);
  const { bool: loading, toggle: Loader } = useBool();

  const handleItemsList = useCallback((items: any) => setItemsList(items), []);

  const onSubmit = (values: SubmitProps) => {
    const newItem = itemsList?.map((item: any) => ({
      ...item,
      id: item?.item_id,
      sales_order_item_detail_id: item?.id,
      extra_description: "",
    }));
    Loader();
    callAxios({
      method: "put",
      url: `${PACKAGES}/${pkgDetail?.id}`,
      data: {
        ...values,
        items: newItem,
        package_date: getFullDateAndTime(values.package_date),
      },
    }).then((res: any) => {
      Loader();
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
        edit
        showModal={bool}
        loading={loading}
        onSubmit={onSubmit}
        SOdetails={SODetails}
        toggleModal={toggleModal}
        has_permission={has_permission}
        handleItemsList={handleItemsList}
        url={`${PACKAGES}/${pkgDetail?.id}/edit`}
      />
    </>
  );
};

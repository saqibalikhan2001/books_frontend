/** @format */
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { SubmitProps } from "./Types";
import { getFullDateAndTime } from "utils";
import { PackageForm } from "./PackageForm";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";

const { PACKAGES: PACKAGES_URL } = endpoints;

const EditPackage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const package_id = searchParams.get("id");
  const { checkPermission } = usePermissions();
  const [itemsList, setItemsList] = useState([]);
  const { callAxios, toggle, bool } = useAxios();
  const { has_PackageEdit_permission } = checkPermission("PackageEdit");

  const handleItemsList = useCallback((items: any) => setItemsList(items), []);

  const onSubmit = (values: SubmitProps) => {
    const newItem = itemsList?.map((item: any) => ({
      ...item,
      id: item?.item_id,
      sales_order_item_detail_id: item?.id,
      extra_description: "",
    }));
    toggle();
    callAxios({
      method: "put",
      url: `${PACKAGES_URL}/${package_id}`,
      data: {
        ...values,
        items: newItem,
        package_date: getFullDateAndTime(values.package_date),
      },
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };

  return (
    <>
      {has_PackageEdit_permission ? (
        <PackageForm
          edit
          loading={bool}
          onSubmit={onSubmit}
          handleItemsList={handleItemsList}
          url={`${PACKAGES_URL}/${package_id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditPackage;

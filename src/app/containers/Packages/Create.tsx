/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitProps } from "./Types";
import { PackageForm } from "./PackageForm";
import { endpoints, routeNames } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { getFullDateAndTime, setKeyInSS } from "utils";
import { Toast, AccessDenied, PageHeaderX } from "app/shared";

const { PACKAGES } = routeNames;
const { PACKAGES: PACKAGES_URL, PACKAGE_CREATE } = endpoints;

export const CreatePackage = () => {
  const navigate = useNavigate();

  const { checkPermission } = usePermissions();
  const [itemsList, setItemsList] = useState([]);
  const { callAxios, toggle, bool } = useAxios();
  const { has_PackageCreate_permission } = checkPermission("PackageCreate");

  const handleItemsList = useCallback((items: any) => setItemsList(items), []);

  const onSubmit = (values: SubmitProps) => {
    toggle();
    callAxios({
      method: "post",
      url: PACKAGES_URL,
      data: {
        ...values,
        items: itemsList,
        package_date: getFullDateAndTime(values.package_date),
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInSS("once", true);
        setKeyInSS("id", res?.data?.id);
        navigate(-1);
      }
    });
  };
  return (
    <>
      {has_PackageCreate_permission ? (
        <>
          <PageHeaderX title="Create Package" navigateTo={PACKAGES} />
          <PackageForm
            loading={bool}
            onSubmit={onSubmit}
            url={PACKAGE_CREATE}
            handleItemsList={handleItemsList}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default CreatePackage;

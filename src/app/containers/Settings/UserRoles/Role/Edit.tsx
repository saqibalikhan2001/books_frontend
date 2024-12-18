/** @format */

import { useEffect, useReducer, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Content, endpoints } from "static";
// import { RoleModal } from "./RoleModal";
import { reducer } from "./Reducer";
import { RoleForm } from "./RoleForm";
import { RoleSubmitProps } from "../Types";
import { allPermissions } from "./roles";
import { filterRolePermissions, setKeyInLS } from "utils";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, useCreateFormApi, useDefaultOrganization, usePermissions } from "app/Hooks";
import { SpinnerX } from "app/shared/PageLoader";

const { ROLE } = endpoints;
const reducerState = {
  sales: [],
  contact: [],
  accounts: [],
  settings: [],
  inventory: [],
  dashboard: [],
  purchases: [],
  preferences: [],
  reports: [],
  tablepreferences: [],
};

const EditRole = () =>
  //{
  //   bool,
  //   toggle,
  //   refetch,
  //   current,
  //   setAlert,
  //   roleAlert,
  //   dispatch,
  //   itemPermissions,
  //   has_permission,
  // }: RoleEditProps
  {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refetch } = useDefaultOrganization();

    const role_id = searchParams.get("id");
    const [current, setCurrent] = useState<any>();
    const { checkPermission, fetchingRoles } = usePermissions();
    const [roleAlert, setAlert] = useState(false);
    const [salesperson, setSalesPerson] = useState(false);
    const { callAxios, bool: loading, toggle } = useAxios();
    const { has_RoleEdit_permission } = checkPermission("RoleEdit");
    const [itemPermissions, dispatch] = useReducer(reducer, reducerState);
    /**Note: for Modal use current.id instead of role_id on the next line  */
    const { details } = useCreateFormApi(`${ROLE}/${role_id}/edit`, has_RoleEdit_permission);
    const [customLoading, setCustomLodaing] = useState(true);

    useEffect(() => {
      if (details?.permissions && has_RoleEdit_permission)
        setCurrent({ ...details, permissions: details.permissions });
    }, [details, has_RoleEdit_permission]);

    const onSubmit = (values: RoleSubmitProps) => {
      // const permissions = allPermissions.filter((vl: any) => vl[vl.id] === true);
      const newArray = filterRolePermissions(itemPermissions);
      const oldList = allPermissions.reduce(
        (obj, item) => Object.assign(obj, { [item.id]: false }),
        {}
      );
      const newList = newArray.reduce((obj, item) => Object.assign(obj, { [item]: true }), {});
      const finalList = Object.assign({}, oldList, newList);

      if (!newArray.length) {
        setAlert(Boolean(!newArray.length));
        window.scrollTo({ top: 0, behavior: "smooth" });
        Toast({
          message: Content.permissions_required,
          type: "error",
        });
        return;
      } else {
        toggle();
        callAxios({
          method: "put",
          data: {
            ...values,
            permissions: finalList,
            sales_person: salesperson,
            slug: values?.slug ? values?.slug : null,
            // slug: values?.sales_person ? "sales_person" : null,
          },
          /**Note: for Modal use current.id instead of role_id on the next line  */
          url: `${ROLE}/${role_id}`,
        }).then((res) => {
          if (res) {
            /** for modal uncomment next two lines and comment navigate */
            // toggle();
            refetch();
            Toast({ message: res.message });
            setKeyInLS("tabKey", "2");
            navigate(-1);
          }
        });
      }
    };
    if (fetchingRoles) return <SpinnerX />;

    return (
      <>
        {/* for Modal uncomment RoleModal, commnet RoleForm and uncomment props in EditRole  */}
        {/* <RoleModal
        bool={bool}
        toggle={toggle}
        loading={loading}
        current={current}
        onSubmit={onSubmit}
        setAlert={setAlert}
        roleAlert={roleAlert}
        dispatch={dispatch}
        has_permission={has_permission}
        itemPermissions={itemPermissions}
      /> */}
        {has_RoleEdit_permission ? (
          <RoleForm
            loading={loading}
            current={current}
            onSubmit={onSubmit}
            setAlert={setAlert}
            dispatch={dispatch}
            roleAlert={roleAlert}
            customLoading={customLoading}
            setSalesPerson={setSalesPerson}
            itemPermissions={itemPermissions}
            setCustomLodaing={setCustomLodaing}
          />
        ) : (
          <AccessDenied />
        )}
      </>
    );
  };

export default EditRole;

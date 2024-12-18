/** @format */

import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content, endpoints } from "static";
// import { RoleModal } from "./RoleModal";
import { reducer } from "./Reducer";
import { setKeyInLS } from "utils";
import { RoleForm } from "./RoleForm";
import { RoleSubmitProps } from "../Types";
import { allPermissions, resetPermissions } from "./roles";
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
  purchases: [],
  dashboard: [],
  preferences: [],
  reports: [],
  tablepreferences: [],
};

const CreateRole = () =>
  //   {
  //   bool,
  //   toggle: Toggle,
  //   refetch,
  //   setAlert,
  //   dispatch,
  //   roleAlert,
  //   itemPermissions,
  //   has_permission,
  // }: RoleCreateProps
  {
    const navigate = useNavigate();
    const { refetch } = useDefaultOrganization();

    const { checkPermission, fetchingRoles } = usePermissions();
    // const [roleAlert, setAlert] = useState(false);
    const { details } = useCreateFormApi("/roles/create");
    const [salesperson, setSalesPerson] = useState(false);
    const { callAxios, bool: loading, toggle } = useAxios();
    const { has_RoleCreate_permission } = checkPermission("RoleCreate");
    const [itemPermissions, dispatch] = useReducer(reducer, reducerState);

    const onSubmit = (values: RoleSubmitProps) => {
      // const permissions = allPermissions.filter((vl) => Boolean(vl[vl.id]));
      const newValues = Object.values(itemPermissions).flat();
      const oldList = allPermissions.reduce(
        (obj, item) => Object.assign(obj, { [item.id]: false }),
        {}
      );
      const newList = newValues.reduce((obj, item) => Object.assign(obj, { [item]: true }), {});

      const finalList = Object.assign({}, oldList, newList);
      if (!newValues.length) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        Toast({
          message: Content.permissions_required,
          type: "error",
        });
        // setAlert( Boolean(!newValues.length));

        return;
      } else {
        toggle();
        callAxios({
          method: "post",
          data: {
            ...values,
            slug: values?.slug ? values?.slug : null,
            sales_person: salesperson,
            permissions: finalList,
          },
          url: ROLE,
        }).then((res) => {
          if (res) {
            /** for modal uncomment next two lines and comment navigate */
            // refetch();
            // Toggle();
            refetch();
            Toast({ message: res.message });
            setKeyInLS("tabKey", "2");
            navigate(-1);
            resetPermissions();
          }
        });
      }
    };
    if (fetchingRoles) return <SpinnerX />;

    return (
      <>
        {/* for Modal uncomment RoleModal, commnet RoleForm and uncomment props in CreateRole  */}

        {/* <RoleModal
        bool={bool}
        toggle={Toggle}
        loading={loading}
        onSubmit={onSubmit}
        setAlert={setAlert}
        dispatch={dispatch}
        roleAlert={roleAlert}
        itemPermissions={itemPermissions}
        has_permission={has_permission}
      /> */}

        {has_RoleCreate_permission ? (
          <RoleForm
            create
            loading={loading}
            details={details}
            onSubmit={onSubmit}
            dispatch={dispatch}
            setSalesPerson={setSalesPerson}
            itemPermissions={itemPermissions}
          />
        ) : (
          <AccessDenied />
        )}
      </>
    );
  };

export default CreateRole;

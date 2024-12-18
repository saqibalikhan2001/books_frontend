/** @format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import { ssoLogoutPath } from "utils";
// import { ImsOrgProps } from "./Types";
import { useTypedDispatch } from "store";
import SharedOrgForm from "./SharedOrgForm";
import { Toast, Buttonx } from "app/shared";
import { endpoints, routeNames } from "static";
import { useAxios, useSharedOrganization } from "app/Hooks";
import { Logout, setDetails } from "store/slices/authSlice";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";

const { LOGIN, REGISTER_ORGANIZATION } = routeNames;

const ImsOrganizations = ({
  refetch,
  closeModal,
  shared = false,
  sharedOrg = [],
  isModal = false,
  general_modules = [],
}: any) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const sso_logout = ssoLogoutPath();
  const dispatch = useTypedDispatch();
  const [orgs, setorgs] = useState<any>();
  const [orgId, setOrdid] = useState<Number>();
  const [module, setModule] = useState<CheckboxValueType[]>();
  const { handleModulePermission } = useSharedOrganization();

  useLayoutEffect(() => {
    isModal && setorgs(sharedOrg);
    setModule([...modules?.filter((val) => val.status).map((val) => val.name)]);
    //eslint-disable-next-line
  }, []);

  const filters = sharedOrg[0]?.module_permissions?.filter((val) => val.status) || [];

  const mds = [...general_modules];

  const modules = filters.length ? mds.map((val) => ({ ...val, status: false })) : mds;
  general_modules?.forEach((val, i) =>
    filters?.forEach((md) => {
      if (md.general_modules_id === val.id) {
        modules[i] = {
          ...modules[i],
          status: true,
        };
      }
    })
  );

  const handleClick = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "false") {
      dispatch(Logout({ url: endpoints.LOGOUT }))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch({ type: RESET_STATE_ACTION_TYPE });
            localStorage.clear();
            navigate(LOGIN, { replace: true });
            Toast({ message: res.message });
          }
        });
    } else {
      window.location.href = sso_logout;
    }
  };

  const handlesubmit = () => {
    let payload = {
      organization_id: Number(orgId),
      modules: handleModulePermission(module, general_modules),
    };
    callAxios({
      method: "post",
      url: endpoints.IMS_MODULE_INTEGRATIONS,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        callAxios({
          url: endpoints.USER_PROFILE,
        }).then((res: any) => {
          dispatch(setDetails(res));
          if (isModal) {
            refetch?.();
            closeModal?.();
          } else {
            navigate(routeNames.DASHBOARD);
          }
        });
      }
    });
  };

  return (
    <>
      <Row align="middle" style={{ margin: "auto 0", width: "100%" }}>
        <Col span={10}>
          {!isModal && (
            <>
              <Buttonx type="link" btnText="Logout" clickHandler={handleClick} />
              <Buttonx
                type="link"
                btnText="Create Organization"
                clickHandler={() =>
                  navigate(REGISTER_ORGANIZATION, {
                    state: "ims-organizations",
                  })
                }
              />
            </>
          )}
        </Col>
        <Col span={24}>
          <SharedOrgForm
            share={shared}
            setOrdid={setOrdid}
            setModule={setModule}
            handlesubmit={handlesubmit}
            organizations={orgs?.ims_organizations || orgs}
          />
        </Col>
      </Row>
    </>
  );
};

export default ImsOrganizations;

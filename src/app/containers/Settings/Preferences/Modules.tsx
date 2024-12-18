/** @format */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Checkbox, Col, Divider, Row, Space, Typography } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { endpoints } from "static";
import { Buttonx, Spinner, Toast, Breadcrumbx } from "app/shared";
import { useGetGeneralModulesQuery } from "store/query/organization";
import {
  useAxios,
  useStore,
  usePermissions,
  useSharedOrganization,
  useDefaultOrganization,
} from "app/Hooks";

const Modules = ({
  isModal = false,
  toggleInnerDrawer,
  innerDrawer,
  setSelected,
  seting = false,
}: any) => {
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();
  const { callAxios, bool, toggle } = useAxios();
  const [module, setModule] = useState<CheckboxValueType[]>();
  //@ts-ignore
  const { handleUpdateUserWithRoles, users_organizations } = useStore();
  const { ownerOrg, handleModulePermission } = useSharedOrganization();
  const { data: general_modules = [], isFetching } = useGetGeneralModulesQuery("", {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
  });
  const { refetch, current_User_Organization } = useDefaultOrganization();
  const { has_ModulePreferenceEdit_permission } = checkPermission("ModulePreferenceEdit");
  const sharedOrg = current_User_Organization?.organizations;
  useEffect(() => {
    if (innerDrawer) {
      let organization = {
        ...users_organizations[users_organizations.length - 1],
      };

      const filters = organization?.module_permissions?.filter((val) => val.status) || [];
      const mds = [...general_modules];

      const module_permissions = filters.length
        ? mds.map((val: any) => ({ ...val, status: false }))
        : mds;
      general_modules.forEach((val: any, i) =>
        filters.forEach((md: any) => {
          if (md.general_modules_id === val.id) {
            module_permissions[i] = {
              ...module_permissions[i],
              status: true,
            };
          }
        })
      );
      organization.module_permissions = module_permissions;
      setSelected(organization);
    }
    //eslint-disable-next-line
  }, [innerDrawer, users_organizations.length]);

  useEffect(() => {
    !innerDrawer && !!sharedOrg?.module_permissions.length
      ? setModule([
          ...sharedOrg.module_permissions.filter((val) => val.status).map((val) => val.name),
        ])
      : setModule(general_modules.map((val) => val.name));
  }, [general_modules, innerDrawer, sharedOrg]);

  const selectModule = (checkedValues) => setModule(checkedValues);

  const handlesubmit = () => {
    toggle();
    const last_created_org = users_organizations[users_organizations.length - 1];
    let payload = {
      organization_id: Number(innerDrawer ? last_created_org?.id : ownerOrg?.id),
      modules: handleModulePermission(module, general_modules),
    };
    callAxios({
      method: "post",
      url: !seting ? endpoints.IMS_MODULE_INTEGRATIONS : "/preference/module_permissions",
      data: payload,
    })
      .then((res) => {
        if (res) {
          toggle();
          Toast({ message: "Module Shared Successfully" });
          innerDrawer && toggleInnerDrawer();
          toggle();
          if (!seting) {
            navigate(`${window.location.pathname}`, { replace: true, state: {} });
          }
          refetch();
        }
      })
      .catch(() => toggle());
    // setTimeout(() => window.location.reload(), 4000);
  };

  // Commented on purpose
  // const handleUnshare = () => {
  //   callAxios({
  //     method: "delete",
  //     url: `${endpoints.UNSHARE_ORGANIZATION}/${ownerOrg?.id}`,
  //   }).then(() => {
  //     Toast({ message: "Organization Unshared successfully" });
  //     callAxios({
  //       url: endpoints.USER_PROFILE,
  //     }).then((res) => {
  //       res && handleUpdateUserWithRoles(res, true);
  //       navigate("/", { replace: true });
  //     });
  //   });
  // };
  return (
    <>
      {isFetching ? (
        <div className="spinner-main">
          <Spinner directionSize={"540px"} />
        </div>
      ) : (
        <div className="main_wrapper">
          {!innerDrawer && <Breadcrumbx name="Modules" className="navigate" setting={true} show />}
          <div className="_container modules_form">
            <Row>
              <Col span={24}>
                <Typography.Title level={4} className="form_heading">
                  Enable the modules required for your business
                </Typography.Title>
              </Col>
              <div className="form_box">
                <Col span={18} style={{ top: "15px" }}>
                  <div className="flexbox">
                    <div className="form_group module-box">
                      <Typography.Text>
                        Products & Services, Estimates, Customer & Supplier are available by default
                        in Seebiz Books.
                      </Typography.Text>
                    </div>
                    <Checkbox.Group
                      value={module}
                      onChange={selectModule}
                      style={{ width: "100%", paddingBottom: "10px" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {!innerDrawer
                          ? sharedOrg?.module_permissions?.map((module) => (
                              <Col span={12} key={module.general_modules_id}>
                                <Checkbox
                                  disabled={
                                    !!(
                                      module.slug === "item" ||
                                      module.slug === "contact" ||
                                      module.slug === "accounts"
                                    )
                                  }
                                  value={module.name}
                                >
                                  {module.name === "Contact"
                                    ? "Customer & Supplier"
                                    : module.name === "Item"
                                    ? "Products & Services"
                                    : module.name}
                                </Checkbox>
                              </Col>
                            ))
                          : general_modules?.map((module) => (
                              <Col span={12} key={module.id}>
                                <Checkbox
                                  disabled={
                                    !!(
                                      module.slug === "item" ||
                                      module.slug === "contact" ||
                                      module.slug === "accounts"
                                    )
                                  }
                                  value={module.name}
                                >
                                  {module.name === "Contact"
                                    ? "Customer & Supplier"
                                    : module.name === "Item"
                                    ? "Products & Services"
                                    : module.name}
                                </Checkbox>
                              </Col>
                            ))}
                      </Space>
                    </Checkbox.Group>
                    <Typography.Text>
                      Note: You can change these details later in settings, if needed.
                    </Typography.Text>
                    <Divider />
                    {(innerDrawer ||
                      ownerOrg?.is_owner ||
                      ownerOrg?.exact_owner ||
                      has_ModulePreferenceEdit_permission ||
                      isModal) && (
                      <Space style={{ width: "90%" }}>
                        <Buttonx
                          loading={bool}
                          clickHandler={handlesubmit}
                          className="btn-form-size btn-primary"
                          btnText={innerDrawer ? "Next" : "Share"}
                        />
                        {/* Comment for purpose */}
                        {/* {ownerOrg?.platform_type === "ims,books" && (         
                      <Popconfirm
                        title="Your Organization data will be removed after unshare. Are you sure to perform this action?"
                        okText="Yes"
                        onConfirm={handleUnshare}>
                        <Button type="link" style={{ marginBottom: "21px" }}>
                          UnShare
                        </Button>
                      </Popconfirm>
                    )} */}
                      </Space>
                    )}
                  </div>
                </Col>
              </div>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};
export default Modules;

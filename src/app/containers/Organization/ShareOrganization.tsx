/** @format */

import { useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router";
import { Checkbox, Col, Divider, Row, Space, Typography } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { endpoints, routeNames, Content } from "static";
import { useTypedDispatch } from "store";
import { Buttonx, Spinner, Toast } from "app/shared";
import { useStore } from "app/Hooks/useStore";
import { setDrawer, setOrganization } from "store/slices/authSlice";
import { useAxios, useDefaultOrganization, useSharedOrganization } from "app/Hooks";
import { useGetGeneralModulesQuery } from "store/query/organization";
import { setAppLoader } from "store/slices/loadingSlice";

const { DASHBOARD } = routeNames;
const { IMS_MODULE_INTEGRATIONS, USER_PROFILE } = endpoints;
const { shared_modules_info } = Content;
export const ShareOrganization = ({ organization, toggleInnerDrawer }: any) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const dispatch = useTypedDispatch();
  const [, startTransition] = useTransition();
  const { refetch } = useDefaultOrganization();
  const [loading, setLoading] = useState(false);
  const { handleUpdateUserWithRoles } = useStore();
  const { handleModulePermission } = useSharedOrganization();
  const [selectedModule, setModule] = useState<CheckboxValueType[]>();
  const { data: general_modules = [], isLoading } = useGetGeneralModulesQuery("");

  useEffect(() => {
    setModule([...modules?.filter((val) => val.status).map((val) => val.name)]);
    //eslint-disable-next-line
  }, []);

  const selectModule = (checkedValues: CheckboxValueType[]) => setModule(checkedValues);

  const filters = organization?.module_permissions?.filter((val) => val.status) || [];
  const mds = [...general_modules];

  const modules = filters.length ? mds.map((val) => ({ ...val, status: false })) : mds;
  general_modules.forEach((val, i) =>
    filters.forEach((md) => {
      if (md.general_modules_id === val.id) {
        modules[i] = {
          ...modules[i],
          status: true,
        };
      }
    })
  );

  const handleSubmit = () => {
    let payload = {
      organization_id: Number(organization.id),
      modules: handleModulePermission(selectedModule, general_modules),
    };
    setLoading(true);
    callAxios({
      method: "post",
      url: IMS_MODULE_INTEGRATIONS,
      data: payload,
    })
      .then((res) => {
        if (res) {
          Toast({ message: res.message });
          dispatch(setOrganization(organization.id));
          dispatch(setDrawer(false));
          dispatch(setAppLoader(true));

          callAxios({
            url: USER_PROFILE,
            org: organization.id,
          }).then((res) => {
            dispatch(setAppLoader(false));

            setLoading(false);
            startTransition(() => {
              toggleInnerDrawer();
            });
            handleUpdateUserWithRoles(res);
            // refetch();
            navigate(DASHBOARD);
            // setTimeout(() => window.location.reload(), 4000);
          });
          refetch();
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spinner directionSize={"483px"} />
      ) : (
        <Row>
          <Col span={24}>
            <Typography.Title level={3}>
              {organization?.platform_type === "ims"
                ? "Shared Business"
                : "Enable the modules required for your business"}
            </Typography.Title>
            <Typography.Text>{shared_modules_info}</Typography.Text>
          </Col>
          <Col span={18} style={{ top: "15px" }}>
            <Checkbox.Group
              defaultValue={
                modules?.filter((val) => val.status)?.map((val) => val.name) || undefined
              }
              style={{ width: "100%", paddingBottom: "10px" }}
              onChange={selectModule}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {modules?.map((module) => (
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
                ))}
              </Space>
            </Checkbox.Group>
            <Typography.Text>
              Note: You can change these details later in settings, if needed.
            </Typography.Text>
            <Divider />
            <Space>
              <Buttonx loading={loading} btnText="Share & Switch" clickHandler={handleSubmit} />
            </Space>
          </Col>
        </Row>
      )}
      {/* <Checkbox.Group
        defaultValue={[...modules?.filter((val) => val.status).map((val) => val.name)]}
        style={{ width: "100%" }}
        onChange={selectModule}
      >
        <Row>
          {modules?.map((module) => (
            <Col span={12} key={module.id}>
              <Checkbox style={{ paddingBottom: "10px" }} value={module.name}>
                {module.name}
              </Checkbox>
              <br />
            </Col>
          ))}
        </Row>
      </Checkbox.Group> */}
    </>
  );
};

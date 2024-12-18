/** @format */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Drawer, Space, Typography, Col, Button, Modal, Image } from "antd";
import { useDefaultOrganization, useStore } from "app/Hooks";
import { ImagePath, ssoLogoutPath, ssoMyProfilePath } from "utils";
import { Register } from "app/containers";
import { useTypedDispatch } from "store";
import { Icons, ModulePermissionModal, Toast } from "app/shared";
import { Logout, setDrawer } from "store/slices/authSlice";
import { routeNames, endpoints } from "static/routes";
// import MainModules from "app/containers/Dashboard/Modules";
import { Listx } from "app/containers/Organization/MenuList";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";

const { LOGOUT } = endpoints;
const { VscAdd } = Icons;

const { ORGANIZATION_LISTING, LOGIN, ORGANIZATION_CREATE } = routeNames;

export const MainDrawer = ({
  collapsed,
  cacheToggle,
}: {
  collapsed: boolean;
  cacheToggle: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sso_logout = ssoLogoutPath();
  const dispatch = useTypedDispatch();
  const [item, setItem] = useState<any>();
  const sso_my_account = ssoMyProfilePath();
  const [selected, setSelected] = useState<any>();
  const [innerDrawer, setInnerDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { permissionModal } = (location.state as any) || {};
  //@ts-ignore
  let force_logout = JSON.parse(localStorage.getItem("force_logout"));

  const {
    drawer,
    is_default,
    users_organizations,
    created_by_platform,
    current_organization_id,
    organization_id,
  } = useStore();
  const { organizations } = useDefaultOrganization();
  useEffect(() => {
    if (permissionModal) {
      setInnerDrawer(true);
    }
  }, [permissionModal]);
  useEffect(() => {
    force_logout && logout();
  }, [force_logout]);

  useEffect(() => {
    if (!!users_organizations && !current_organization_id) {
      dispatch(setDrawer(!!users_organizations.length && !current_organization_id));
    }
    //eslint-disable-next-line
  }, [users_organizations, current_organization_id]);
  useEffect(()=>{
    if(collapsed){
      document.body.style.width= "100%";
      // document.body.style.overflow="hidden"
    }else{
      document.body.removeAttribute('style')
    }
  },[collapsed])
  const current_organization = organizations.find(
    (org) => org?.organization_id === organization_id
  );
  const logout = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "false") {
      dispatch(Logout({ url: LOGOUT }))
        .unwrap()
        .then((res) => {
          if (res) {
            cacheToggle();
            dispatch({ type: RESET_STATE_ACTION_TYPE });
            localStorage.clear();
            navigate(LOGIN, { replace: true });
            Toast({ message: res.message });
          }
        });
    } else {
      // dispatch({ type: RESET_STATE_ACTION_TYPE });

      window.location.href = sso_logout;
    }
  };

  const myAccount = () => {
    if (import.meta.env.VITE_SSO_ENABLE === "true") {
      window.open(sso_my_account);
    }
  };

  const toggleInnerDrawer = () => {
    setInnerDrawer((prev) => !prev);
    setItem(null);
    setSelected(null);
  };
  const setInnerDrawerDetail = (item) => {
    item.created_by_platform === "ims" &&
      setItem({
        ...item,
        // modules: general_modules
      });
    setInnerDrawer(true);
  };
  const toggleModel = () => {
    setSelected(null);
    setIsModalOpen((prev) => !prev);
  };

  const handleOrgCreate = () => {
    if (current_organization_id) cacheToggle();
    dispatch(setDrawer(false));
    navigate(`${ORGANIZATION_CREATE}?org=create`);
  };

  return (
    <>
      {innerDrawer && (
        <ModulePermissionModal
          item={item}
          selected={selected}
          innerDrawer={innerDrawer}
          setSelected={setSelected}
          toggleInnerDrawer={toggleInnerDrawer}
        />
      )}
      {(collapsed || drawer) && (
        <Drawer
          width={369}
          maskClosable={!!current_organization_id}
          contentWrapperStyle={{
            top: "54px",
          }}
          bodyStyle={{ padding: "10px" }}
          // headerStyle={{
          //   backgroundColor: "#f3f8fe",
          //   borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
          // }}
          className="settings-sidebar-header"
          zIndex={500}
          title={
            <Space
              style={{
                display: "flex",
                alignItems: "inherit",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="profileTopSec">
                {current_organization_id && (
                  <Typography style={{ textAlign: "end", cursor: "pointer" }}>
                    <img
                      onClick={cacheToggle}
                      src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/close-modal.svg"
                      alt="close Icon"
                    />
                    {/* <VscClose size={25} onClick={cacheToggle} style={{ cursor: "pointer" }} /> */}
                  </Typography>
                )}

                <Avatar
                  className="orgImg d-flex"
                  size={100}
                  src={
                    <Image
                      height={100}
                      preview={false}
                      src={
                        current_organization?.organizations?.logo
                          ? ImagePath(
                              current_organization?.organizations?.logo as string,
                              created_by_platform
                            )
                          : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                              import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_IMAGE
                            }`
                      }
                    />
                  }
                />

                <Col
                  span={24}
                  className="org_name text_truncate line-clamp-2"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  {current_organization?.organizations?.name || ""}
                </Col>
                <Col
                  span={24}
                  className="org_name text_truncate line-clamp-2 organization--name"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  {current_organization?.organizations?.company_email}
                </Col>

                <Typography.Text
                  style={{
                    fontSize: "12px",
                    fontWeight: "100px",
                    color: "#777",
                  }}
                  ellipsis={{ tooltip: "Organization Name here" }}
                >
                  {organizations?.name || is_default?.name || ""}
                </Typography.Text>

                <Typography.Text
                  style={{
                    fontSize: "12px",
                    fontWeight: "100px",
                    color: "#777",
                  }}
                  // ellipsis={{
                  //   tooltip: `${
                  //     organizations?.organizations
                  //       ?.primary_contact_email || "Email here"
                  //   }`,
                  // }}
                >
                  {organizations?.primary_contact_email || is_default?.primary_contact_email || ""}
                </Typography.Text>

                <div className="d-flex justify_between w-100 ">
                  <Typography.Link onClick={myAccount} className="myAcc">
                    My Account
                  </Typography.Link>
                  {/* <Divider
                        type="vertical"
                        style={{
                          borderLeft: "2px solid rgba(0, 0, 0, 0.5)",
                          fontSize: "20px",
                        }}
                      /> */}
                  <Typography.Link onClick={logout} className="signOut">
                    Sign Out
                  </Typography.Link>
                </div>
              </div>
              {/* <Col
                  span={24}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography.Text style={{ fontSize: "14px" }}>My Businesses</Typography.Text>
                  <Space style={{ paddingBottom: "5px" }}>
                    <Typography>
                      <AiOutlineSetting style={{ display: "flex" }} size={16} color="#2485e8" />
                    </Typography>

                    {current_organization_id && (
                      <Link to={ORGANIZATION_LISTING} onClick={cacheToggle}>
                        <Typography.Link
                          className="hover-underline"
                          style={{ fontSize: "14px", color: "#2485e8" }}
                        >
                          Manage
                        </Typography.Link>
                      </Link>
                    )}
                  </Space>
                </Col> */}

              <div className="myBussinessArea d-flex justify_between align-center">
                <Typography.Text className="busTitle">My Businesses</Typography.Text>
                <div className="myBussinessRight d-flex">
                  <Space>
                    {current_organization_id && (
                      <Link
                        className="bussiness_manage d-flex"
                        to={ORGANIZATION_LISTING}
                        onClick={cacheToggle}
                        style={{ gap: 8 }}
                      >
                        <Typography>
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/settings.svg`}
                            className={`cursor setting_filter`}
                            alt="gear"
                            width={13}
                          />
                        </Typography>
                        <Typography.Link className="manageText">Manage</Typography.Link>
                      </Link>
                    )}
                  </Space>
                  <Button
                    className="btn-primary d-flex align-center new-org-btn"
                    icon={<VscAdd size={14} />}
                    type="primary"
                    // for Modal onClick={toggleModel}
                    onClick={handleOrgCreate}
                  >
                    {`${current_organization_id ? "New" : "Register"} `}
                  </Button>
                </div>
              </div>
            </Space>
          }
          destroyOnClose
          placement="right"
          closable={false}
          onClose={cacheToggle}
          open={collapsed || drawer}
          // open={collapsed || (!!users_organizations.length && !current_organization_id)}
        >
          {/* <Space
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "15px",
            }}
          >
            <Button
              className="btn-primary d-flex align-center"
              icon={<VscAdd size={14} />}
              type="primary"
              // for Modal onClick={toggleModel}
              onClick={handleOrgCreate}
            >
              {`${current_organization_id ? "New" : "Register"} Organization`}
            </Button>
          </Space> */}
          <Listx cacheToggle={cacheToggle} openInnerDrawer={setInnerDrawerDetail} />
        </Drawer>
      )}
      {isModalOpen && (
        <Modal
          width={700}
          footer={null}
          destroyOnClose
          open={isModalOpen}
          style={{ top: "0" }}
          maskClosable={false}
          title={`${current_organization_id ? "Create" : "Register"} Organization`}
          onCancel={toggleModel}
        >
          <Register toggleModel={toggleModel} />
        </Modal>
      )}
    </>
  );
};

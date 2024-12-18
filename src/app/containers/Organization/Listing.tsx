/** @format */

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Typography, Row, Col } from "antd";
// import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useTypedDispatch } from "store";
import ListView from "./ListingView/ListView";
import GridView from "./ListingView/GridView";
import { endpoints, routeNames } from "static";
import { useAxios, useBool, useStore } from "app/Hooks";
import { setOrganization } from "store/slices/authSlice";
import { set_organization } from "store/slices/OrganizationSlice";
import { useGetOrganizationsQuery } from "store/query/organization";
import { Icons, Toast, InputField, ModulePermissionModal } from "app/shared";

const { Title } = Typography;
const { AiOutlineSearch } = Icons;
const { ORGANIZATION_CREATE, DASHBOARD } = routeNames;

const OrganizationListing = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [org, setOrg] = useState({});
  const dispatch = useTypedDispatch();
  const [orgList, setOrgList] = useState([]);
  const { handleUpdateUserWithRoles } = useStore();
  const [innerDrawer, setInnerDrawer] = useState(false);
  const {
    bool: list,
    // toggle
  } = useBool(true);
  const {
    isLoading,
    data: { organizations = [], role = {} } = {},
    refetch,
  } = useGetOrganizationsQuery("", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    setOrgList(organizations);
  }, [organizations]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const data = organizations.filter((org) =>
      org?.organizations?.name.includes(value.toLowerCase() || value.toUpperCase())
    );
    value ? setOrgList(data) : setOrgList(organizations);
  };

  const handleClick = useCallback(
    (org_id: number) => {
      dispatch(
        set_organization({
          url: `${endpoints.SET_ORGANIZATION}/${org_id}`,
          method: "post",
        })
      )
        .unwrap()
        .then((res) => {
          Toast({ message: res.message });
          refetch();
        });
    },
    [dispatch, refetch]
  );

  const handleSwitchClick = useCallback(
    (org_id: number) => {
      dispatch(set_organization({ url: `${endpoints.ORGANIZATIONS}/${org_id}` }))
        .unwrap()
        .then(() => {
          Toast({ message: "Organization Switch Successfully" });
          dispatch(setOrganization(org_id as any));
          refetch();
          callAxios({
            url: endpoints.USER_PROFILE,
            org: org_id,
          }).then((res) => {
            //@ts-ignore
            localStorage.setItem("org_id", org_id);
            res && handleUpdateUserWithRoles(res);
            // setTimeout(() => window.location.reload(), 4000);
          });
          navigate(DASHBOARD);
        });
    },
    //eslint-disable-next-line
    [dispatch, handleUpdateUserWithRoles]
  );

  const handleEditClick = useCallback(
    (org_id: number) => {
      navigate(`/organization-profile?org=${org_id}`);
    },
    [navigate]
  );

  const toggleInnerDrawer = useCallback(() => setInnerDrawer(!innerDrawer), [innerDrawer]);

  const getCurrentSharedOrg = useCallback(
    (org) => {
      setOrg({ ...org });
      toggleInnerDrawer();
    },
    [toggleInnerDrawer]
  );

  // item={org}
  // collapsed={innerDrawer}
  // closeDrawer={toggleInnerDrawer}
  // toggleInnerDrawer={toggleInnerDrawer}

  return (
    <>
      {innerDrawer && (
        <ModulePermissionModal
          item={org}
          innerDrawer={innerDrawer}
          toggleInnerDrawer={toggleInnerDrawer}
        />
      )}
      <PageHeader
        className="generic_top_header"
        title={
          <Title style={{ marginTop: 0, marginBottom: 0, fontWeight: "bold" }} level={4}>
            Manage Businesses
          </Title>
        }
        extra={
          <Button
            key="1"
            className="d-flex align-center btn-primary"
            onClick={() => navigate(`${ORGANIZATION_CREATE}?org=create`)}
          >
            <img src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`} className="mr-5 required_clr--white" alt="plus icon" />
            Add New
          </Button>
        }
      />
      {import.meta.env.VITE_SEARCH_ORG === "true" && (
        <Row style={{ justifyContent: "center", marginTop: 30 }}>
          <Col span={8}>
            <InputField
              label=""
              name="search"
              onChange={handleSearch}
              placeholder="Search by name"
              addonAfter={<AiOutlineSearch />}
            />
          </Col>
        </Row>
      )}

      {/* <Row style={{ justifyContent: "end" }}>
        <Col>
          <Segmented
            onChange={() => toggle()}
            options={[
              {
                value: "List",
                icon: <BarsOutlined />,
              },
              {
                value: "Grid",
                icon: <AppstoreOutlined />,
              },
            ]}
          />
        </Col>
      </Row> */}

      {!list ? (
        <ListView
          role={role}
          isLoading={isLoading}
          organizations={orgList}
          handleClick={handleClick}
          handleEditClick={handleEditClick}
          handleSwitchClick={handleSwitchClick}
          getCurrentSharedOrg={getCurrentSharedOrg}
        />
      ) : (
        <GridView
          role={role}
          refetch={refetch}
          organizations={orgList}
          handleClick={handleClick}
          handleEditClick={handleEditClick}
          handleSwitchClick={handleSwitchClick}
          getCurrentSharedOrg={getCurrentSharedOrg}
        />
        // <DetailPage />
      )}
    </>
  );
};

export default OrganizationListing;

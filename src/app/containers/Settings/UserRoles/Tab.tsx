/** @format */

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Button, Typography, Input } from "antd";
import { endpoints, routeNames } from "static";
import { UserDetails } from "./User";
import { RoleDetails } from "./Role";
// import { UsersDetails } from "./Users";
import { CreateInviteUser } from "./User/Create";
import { PageHeader } from "@ant-design/pro-layout";
import { Selectx } from "app/shared";
import { useGetroleListingQuery } from "store/query/roles";
import { useGetInviteeListingQuery } from "store/query/invite";
import { useBool, useCustomParams, usePermissions } from "app/Hooks";
import { getKeyFromSS, removeKeyFromSS } from "utils";
// import "assets/scss/shared/_usertabs.scss";
// import 'assets/scss/organization/_viewDetails.scss'

const { Title } = Typography;
const { ADD_ROLE } = routeNames;

const options = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "in_active", label: "Inactive" },
  { id: "invited", label: "Invited" },
];

const UserRoles = () => {
  const navigate = useNavigate();
  const state = getKeyFromSS("userModal");
  const [users, setUsers] = useState<any>();
  const [roles, setRoles] = useState<any>();
  const [current, setCurrent] = useState("1");
  const [inputSearchvalue, setinputSearchvalue] = useState("");
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleUser } = useBool();
  const { has_UserView_permission } = checkPermission("UserView");
  const { has_RoleView_permission } = checkPermission("RoleView");
  const { has_RoleCreate_permission } = checkPermission("RoleCreate");
  const { has_UserCreate_permission } = checkPermission("UserCreate");

  const handleChange = (e) => setCurrent(e);
  const { sorting, handleParams, onChange } = useCustomParams(
    current === "1" ? "users" : "roles",
    current
  );
  const tabkey = getKeyFromSS("tabKey");
  const {
    data: Users = [],
    refetch: refetchUsers,
    isLoading: userLoading,
    isFetching: fetchingUsers,
  } = useGetInviteeListingQuery(sorting, {
    refetchOnMountOrArgChange: true,
    skip: !has_UserView_permission || current === "2",
  });
  const {
    data: Roles = [],
    refetch: refetchRoles,
    isLoading: roleLoading,
    isFetching: fetchingRoles,
  } = useGetroleListingQuery(sorting, {
    refetchOnMountOrArgChange: true,
    skip: !has_RoleView_permission || current === "1",
  });
  useEffect(() => {
    if (state) {
      toggleUser();
    }
  }, [state]);
  useEffect(() => {
    current === "1" && setUsers(Users);
    if (tabkey) {
      setCurrent(tabkey);
      removeKeyFromSS("tabKey");
    }
  }, [Users, tabkey]);

  useEffect(() => {
    current === "2" && setRoles(Roles);
  }, [Roles]);
  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filteredValue = removeEmojis(value);
    setinputSearchvalue(filteredValue);
    if (current === "1") {
      const data = Users.filter((user) =>
        user?.name.toLowerCase().includes(filteredValue.toLowerCase())
      );
      filteredValue ? setUsers(data) : setUsers(Users);
    }
    if (current === "2") {
      const data = Roles.filter((role) =>
        role?.name.toLowerCase().includes(filteredValue.toLowerCase())
      );
      filteredValue ? setRoles(data) : setRoles(Roles);
    }
  };

  const handleFilters = (value: string) =>
    handleParams({
      ...sorting,
      filter: value,
    });

  const memoizeTabChild = useMemo(
    () => [
      {
        key: "1",
        label: <label>Users</label>,
        children: (
          <UserDetails
            bool={bool}
            data={users}
            onChange={onChange}
            toggle={toggleUser}
            refetch={refetchUsers}
            isLoading={userLoading}
            isFetching={fetchingUsers}
          />
        ),
      },
      {
        key: "2",
        label: <label>Roles</label>,
        // children: <RoleDetails bool={role} toggle={toggleRole} />,
        children: (
          <RoleDetails
            data={roles}
            onChange={onChange}
            refetch={refetchRoles}
            isLoading={roleLoading}
            isFetching={fetchingRoles}
          />
        ),
      },
      // {
      //   key: "3",
      //   label: "Users",
      //   children: <UsersDetails />,
      // },
    ],
    [
      users,
      roles,
      bool,
      onChange,
      toggleUser,
      userLoading,
      roleLoading,
      refetchUsers,
      refetchRoles,
      fetchingRoles,
      fetchingUsers,
    ]
  );
  return (
    <>
      <PageHeader
        className="tabs-header ml-10 mr-10  __user_roles_header"
        title={<Title level={5}>Users & Roles</Title>}
        extra={
          <>
            {has_UserCreate_permission && (
              <Button onClick={toggleUser} className="btn-default btn-form-size">
                Invite User
              </Button>
            )}
            {has_RoleCreate_permission && (
              <Button
                type="primary"
                className="btn-primary btn-form-size d-flex align-center"
                icon={
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                    alt="plus icon"
                    className="mr-5 required_clr--white"
                  ></img>
                }
                // onClick={current === "1" ? toggleUser : toggleRole}
                onClick={() => navigate(ADD_ROLE)}
              >
                Add New
              </Button>
            )}
          </>
        }
      />
      <Tabs
        className="user-tabs res_scroll mt-10 pt-8 pb-8"
        tabBarExtraContent={
          <>
            {has_UserView_permission && (
              <div className="d-flex mr-15 user_form_fields">
                {current === "1" && (
                  <Input
                    size="middle"
                    name="search"
                    value={inputSearchvalue}
                    onChange={handleSearch}
                    placeholder="Search by User"
                    suffix={
                      <img
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/search.svg`}
                        alt="search==here"
                      ></img>
                    }
                    className="w-300 mb-0 fields_field mr-20 w-300"
                  />
                )}

                {current === "1" && (
                  <Selectx
                    className="w-300 flx-flow_setting mb-0 filter-field extra-space-remove"
                    name=""
                    defaultValue="all"
                    size="middle"
                    options={options}
                    label={<label>Filter by status:</label>}
                    placeholder="All"
                    handleChange={handleFilters}
                  />
                )}
              </div>
            )}
            <div className="d-flex mr-15 user_form_fields">
              {current === "2" && has_RoleView_permission && (
                <Input
                  size="middle"
                  name="search"
                  value={inputSearchvalue}
                  onChange={handleSearch}
                  placeholder="Search by Role"
                  suffix={
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/search.svg`}
                      alt="search==here"
                    ></img>
                  }
                  className="w-300 mb-0 fields_field mr-20 w-300"
                />
              )}
            </div>
          </>
        }
        activeKey={current}
        items={memoizeTabChild}
        onTabClick={handleChange}
      />
      {bool && (
        <CreateInviteUser
          bool={bool}
          toggle={toggleUser}
          refetch={refetchUsers}
          has_permission={has_UserCreate_permission}
          url={`${endpoints.INVITE_USER}${endpoints.CREATE}`}
        />
      )}
    </>
  );
};
export default UserRoles;

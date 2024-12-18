/** @format */

import { Avatar, Card, List, Tag, Typography } from "antd";
import { Icons } from "app/shared";
import { useNavigate } from "react-router";
import { ImagePath } from "utils";
// import { useRequest } from "ahooks";
import { useAxios, useDefaultOrganization, useStore } from "app/Hooks";
import { Toast } from "app/shared/Alert";
import { TooltipX } from "app/shared/ToolTip";
import { endpoints, Labels, routeNames } from "static";
import { useTypedDispatch } from "store";
import { setAppLoader } from "store/slices/loadingSlice";
import { MenuListProps } from "./Types";
import { RolepermissionQuery } from "store/query/permissions";

const { Meta } = List.Item;
const { DASHBOARD } = routeNames;
const { OWNER, INVITEE } = Labels;
const { USER_PROFILE } = endpoints;
const { BsCheckCircleFill } = Icons;

export const Listx = ({ cacheToggle, openInnerDrawer }: MenuListProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const dispatch = useTypedDispatch();
  const { organizations = [], isLoading } = useDefaultOrganization();
  const { organization_id, handleUpdateUserWithRoles, current_organization_id } = useStore();

  const handleClick = (item) => {
    if (current_organization_id === item?.id) return;
    return new Promise((resolve) => {
      if (item.platform_type === "ims" && item.is_owner === false)
        resolve(Toast({ message: "Permission Not Granted By Admin", type: "info" }));
      else if (item.platform_type === "ims" && (item.is_owner || item.exact_owner))
        resolve(openInnerDrawer(item));
      else if (["books", "ims,books"].includes(item.platform_type)) {
        dispatch(setAppLoader(true));
        callAxios({
          url: USER_PROFILE,
          org: item.id,
        }).then((res) => {
          dispatch(RolepermissionQuery.util.resetApiState());
          localStorage.setItem("switch_org", JSON.stringify(true));
          localStorage.setItem("org_id", item.id);
          localStorage.setItem("prev_org_id", current_organization_id as any);
          localStorage.setItem("acc_found", JSON.stringify(false));
          dispatch(setAppLoader(false));
          Toast({ message: "Organization Switch Successfully" });
          res && resolve(handleUpdateUserWithRoles(res));
          cacheToggle();
        });
        navigate(DASHBOARD);
      }
    });
  };

  // const { run } = useRequest(handleClick, {
  //   debounceWait: 200,
  //   manual: true,
  // });

  return (
    <List
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={organizations}
      renderItem={(item: any) => (
        <>
          <Card
            hoverable={!item.organizations?.is_unshared}
            onClick={() => handleClick(item?.organizations)}
            // bodyStyle={{ height: "100px" }}
            className="organization-card-toggle org-card-new"
            style={{
              // height: "100px",
              marginBottom: "10px",
              background: item.organizations?.is_unshared ? "#ebebebc7" : "",
            }}
            cover={
              <List.Item
                className={`listItem d-flex ${
                  item.organizations?.id === +organization_id ? "active" : ""
                }`}
                key={item.organizations?.id}
                extra={
                  <TooltipX
                    title={
                      item.organizations?.exact_owner && item.organizations?.id === +organization_id
                        ? "Current Business"
                        : item.organizations?.is_unshared
                        ? "Unshared Business"
                        : ""
                    }
                  >
                    {item.organizations?.id === +organization_id && (
                      <BsCheckCircleFill
                        size="22"
                        color={
                          ["books", "ims,books"].includes(item.organizations?.platform_type) &&
                          item.organizations?.id === +organization_id
                            ? "green"
                            : ""
                          // : item.organizations?.is_unshared
                          // ? "red"
                          // : "gray"
                        }
                      />
                    )}
                  </TooltipX>
                }
              >
                <Meta
                  // logo will be here in
                  avatar={
                    <Avatar
                      className="avt-logo"
                      src={
                        item?.organizations?.logo
                          ? ImagePath(
                              item.organizations?.logo,
                              item.organizations?.created_by_platform
                            )
                          : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                              import.meta.env.VITE_ORGANIZATION_PLACEHOLDER_SMALL_IMAGE
                            }`
                      }
                    />
                  }
                  title={
                    <div className="card-sec">
                      <Typography className="text_truncate line-clamp-2">
                        {item.organizations?.name || ""}
                      </Typography>
                      {/* <Typography>{item.organizations?.primary_contact_name || ""}</Typography> */}
                      <div className="d-flex" style={{ gap: 10 }}>
                        {item?.organizations?.platform_type !== "books" && (
                          <Tag
                            key="4"
                            // icon={<CgOrganisation style={{ marginRight: "3px" }} />}
                            className="mr-0 share-unshared"
                            style={{
                              backgroundColor:
                                item?.organizations?.platform_type === "ims"
                                  ? "#ffe4e8"
                                  : "#def0ff",
                              color:
                                item?.organizations?.platform_type === "ims"
                                  ? "#b2001e"
                                  : "#006cbf",
                            }}
                            // color="black"
                          >
                            {item?.organizations?.platform_type === "ims" ? "UnShared" : "Shared"}
                          </Tag>
                        )}
                        <Tag
                          className="organization-badge share-unshared"
                          key="icon"
                          // icon={<CgOrganisation />}
                          color={
                            item.organizations?.is_owner ||
                            (item.organizations?.is_owner === null &&
                              item.organizations?.exact_owner)
                              ? "success"
                              : "warning"
                          }
                        >
                          {item.organizations?.is_owner ||
                          (item.organizations?.is_owner === null && item.organizations?.exact_owner)
                            ? OWNER
                            : INVITEE}
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            }
          ></Card>
        </>
      )}
    />
  );
};

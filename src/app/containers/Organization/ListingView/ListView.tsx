import { useMemo } from "react";
import { Button, Image, Space, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Labels } from "static";
import { ImagePath } from "utils";
import { Icons } from "app/shared";
import { useAxios, useStore } from "app/Hooks";

const { Text } = Typography;
const { SET_AS_DEFAULT } = Labels;
const { CgOrganisation, AiOutlineFileImage } = Icons;

const ListView = ({
  isLoading,
  role = {},
  handleClick,
  organizations,
  handleEditClick,
  handleSwitchClick,
  getCurrentSharedOrg,
}: any) => {
  const { organization_id } = useAxios();
  const { created_by_platform } = useStore();

  const memoColumns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "organizations",
        width: 160,
        ellipsis: true,
        // sortDirections: ["descend"],
        // sorter: (a, b) => a.name.length - b.name.length,
        render: (organization: { logo: string; created_by_platform: string; name: string }) => (
          <Space>
            <Image
              preview={false}
              style={{ width: 50 }}
              src={ImagePath(organization?.logo, created_by_platform)}
              fallback="https://cdn-icons-png.flaticon.com/512/456/456283.png"
              placeholder={<AiOutlineFileImage style={{ width: 36, height: 35 }} />}
            />
            <Text>{organization?.name}</Text>
          </Space>
        ),
      },
      {
        title: "Business ID",
        dataIndex: "organizations",
        width: 90,
        ellipsis: true,
        // sortDirections: ["descend"],
        // sorter: (a, b) => a.name.length - b.name.length,
        //@ts-ignore
        render: (organization: { business_id: string }) => <Text>{organization?.business_id}</Text>,
      },
      {
        title: "Subscription",
        dataIndex: "organizations",
        ellipsis: true,
        width: 100,
        // sortDirections: ["descend"],
        // sorter: (a, b) => a.name.length - b.name.length,
        render: (organization: { organization_plan: { name: string } }) => (
          <Text>{organization?.organization_plan?.name}</Text>
        ),
      },
      {
        title: "Role",
        dataIndex: "",
        width: 100,
        ellipsis: true,
        // sortDirections: ["descend"],
        // sorter: (a, b) => a.name.length - b.name.length,
        render: () => <Text>{role?.name}</Text>,
      },
      {
        title: "Pending Tasks",
        dataIndex: "",
        width: 75,
        ellipsis: true,
        // sortDirections: ["descend"],
        // sorter: (a, b) => a.name.length - b.name.length,
        render: () => <Text>0</Text>,
      },
      {
        title: "Actions",
        dataIndex: "",
        width: 180,
        key: "x",
        align: "center" as const,
        render: (item: any) => (
          <Space>
            {["books", "ims,books"].includes(item?.platform_type) &&
              item?.organizations?.is_owner &&
              !item?.organizations?.is_default && (
                <Button shape="round" onClick={() => handleClick(item?.organization_id)}>
                  {SET_AS_DEFAULT}
                </Button>
              )}
            {["books", "ims,books"].includes(item?.platform_type) &&
              item?.organizations?.is_owner &&
              item?.organizations?.is_default && <Text style={{ color: "red" }}>Default</Text>}
            {["books", "ims,books"].includes(item?.platform_type) &&
              item?.organizations?.id !== +organization_id && (
                <Button shape="round" onClick={() => handleSwitchClick(item?.organization_id)}>
                  Switch
                </Button>
              )}
            {item?.organizations?.platform_type === "books" && item.organizations?.is_owner && (
              <Button shape="round" onClick={() => handleEditClick(item?.organization_id)}>
                Edit
              </Button>
            )}
            {item?.platform_type === "ims,books" && (
              <Tag
                key="icon"
                icon={<CgOrganisation style={{ marginRight: "5px" }} />}
                style={{ borderRadius: "10px", padding: "7px" }}
                color={item?.organizations?.is_owner ? "success" : "warning"}
              >
                Shared
              </Tag>
            )}
            {/* {item.organizations?.is_unshared && (
                    <Tag
                      key="icon"
                      icon={<CgOrganisation style={{ marginRight: "5px" }} />}
                      style={{ borderRadius: "10px", padding: "7px" }}
                      color="red"
                    >
                      Un-Shared
                    </Tag>
                  )} */}
            {item?.organizations?.platform_type === "ims" && item?.organizations?.is_owner && (
              <Button
                key="1"
                shape="round"
                className="pr-color"
                onClick={() => {
                  getCurrentSharedOrg(item?.organizations);
                }}
                style={{
                  outline: "none",
                }}
              >
                Share & Switch
              </Button>
            )}
          </Space>
        ),
      },
    ],

    [
      role?.name,
      handleClick,
      organization_id,
      handleEditClick,
      handleSwitchClick,
      getCurrentSharedOrg,
      created_by_platform,
    ]
  );
  return (
    <Table
      pagination={false}
      loading={isLoading}
      columns={memoColumns}
      dataSource={organizations}
    />
  );
};

export default ListView;

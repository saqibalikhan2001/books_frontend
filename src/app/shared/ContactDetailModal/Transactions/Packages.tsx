/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";
const { DATE, PACKAGE_NO, STATUS } = Labels;

const Packages = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "package_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (package_date: string) => getOrganizationDate(package_date, org_date_format),
      },
      {
        title: PACKAGE_NO,
        dataIndex: "package_no",
        key: PACKAGE_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 110,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag
            autoCapitalize=""
            key={content_type}
            className={`generic-badge ${
              content_type === "not shipped" ? "not-shipped" : content_type
            }`}
          >
            {capitalize(content_type)}
          </Tag>
        ),
      },
    ],
    []
  );
  return (
    <Tablex transaction rowKey="package_no" columns={memoColumns} url={`${url}?filter=packages`} />
  );
};

export default Packages;

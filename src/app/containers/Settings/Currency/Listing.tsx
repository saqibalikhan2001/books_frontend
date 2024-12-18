/**@format */

import { useMemo } from "react";
import { Space, Table, Typography } from "antd";
import { Labels } from "static";
import { Icons } from "app/shared";
import { useSearchParam } from "app/Hooks";
import { ColumnsType } from "antd/es/table";
import { CurrencyDataSource, CurrencyListingProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";

const { Text } = Typography;
const { GrCurrency } = Icons;
const { NAME, SYMBOL, CODE, EXCHANGE_RATE } = Labels;

const CurrencyListing = ({
  total,
  loading,
  listing = [],
}: // handleClick,
// handleConfirm,
// has_permission,
CurrencyListingProps) => {
  const { onChange, getParams } = useSearchParam("");
  const { page, pageSize } = getParams();

  const memoColumns: ColumnsType<CurrencyDataSource> = useMemo(
    () => [
      {
        title: NAME,
        key: NAME,
        width: 500,
        responsive: ["sm"],
        render: (props: { name: string; basic_currency_status?: boolean }) => (
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{props.name}</Typography>
            {props?.basic_currency_status && (
              <TooltipX title="Base Currency">
                <GrCurrency size={20} />
              </TooltipX >
            )}
          </Space>
        ),
      },
      {
        key: SYMBOL,
        width: 200,
        title: SYMBOL,
        dataIndex: "symbol",
        align: "center" as const,
      },
      {
        key: CODE,
        width: 150,
        title: CODE,
        ellipsis: true,
        align: "center" as const,
        dataIndex: "currency_code",
        responsive: ["md"],
      },
      {
        width: 150,
        ellipsis: true,
        key: EXCHANGE_RATE,
        title: EXCHANGE_RATE,
        dataIndex: "exchange_rate",
        align: "center" as const,
        responsive: ["sm"],
        render: (rate: number | null) => (
          <Typography>
            {`${rate}`}
            <TooltipX title="Currency Rate">
              <Text code>%</Text>
            </TooltipX >
          </Typography>
        ),
      },
    ],
    []
  );

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Table
        bordered
        loading={loading}
        onChange={onChange}
        dataSource={listing}
        columns={memoColumns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          columnWidth: 30,
        }}
        pagination={{
          total: total,
          current: page, //Current page number
          pageSize: pageSize, //Number of data items per page
          size: "small",
          showTotal: () => (
            <Space>
              <Typography.Title level={5} code>{`Total:  ${total}`}</Typography.Title>
            </Space>
          ),
          showLessItems: true,
          position: ["topRight"],
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
        rowKey={(record: any) => record.id}
      />
    </>
  );
};

export default CurrencyListing;

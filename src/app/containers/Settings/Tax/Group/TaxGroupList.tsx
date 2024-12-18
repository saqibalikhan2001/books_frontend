import { Table } from "antd";
import { TaxGroupListProps } from "../Types";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "Name",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "Rate",
  },
];

export const TaxGroupList = ({
  data,
  setSelected,
  currSelected,
  setCurrSelected,
}: TaxGroupListProps) => {
  const onSelectChange = (selectedRowKeys) => {
    setSelected(selectedRowKeys);
    setCurrSelected(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys: currSelected,
    onChange: onSelectChange,
  };

  return (
    <>
      <Table
        pagination={false}
        showHeader={false}
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={(record: any) => record.id}
      />
    </>
  );
};

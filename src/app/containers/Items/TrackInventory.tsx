/**@format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, InputNumber, Popconfirm, Space, Table } from "antd";
import { Icons, Selectx } from "app/shared";
import { WarehouseProps } from "../Sales/Types";
import { ItemStockProps, TrackInventoryProps } from "./Types";

const { RiDeleteBinLine } = Icons;

const TrackInventory = ({
  create,
  warehouses,
  itemDetails,
  handleWareshouseList,
}: TrackInventoryProps) => {
  const [rowCount, setRowCount] = useState(1);
  const [dataSource, setDataSource] = useState<WarehouseProps[]>([]);

  useEffect(() => {
    if (create) {
      const listing = warehouses.filter((ware: { is_primary: boolean }) => ware.is_primary);
      setDataSource(listing);
      handleWareshouseList(listing);
    }
    //eslint-disable-next-line
  }, [create, warehouses]);

  useEffect(() => {
    if (!create) {
      const listing = itemDetails?.stocks?.map((stock: ItemStockProps, index: number) => ({
        key: `${index}`,
        id: stock?.warehouse_id,
        address: stock?.warehouse?.address,
        opening_stock: stock?.opening_quantity,
      })) as WarehouseProps[];
      setDataSource(listing);
      handleWareshouseList(listing);
    }
    //eslint-disable-next-line
  }, [create, warehouses]);

  const handleConfirm = (props: { key: number | string }) => {
    const newData = dataSource.filter((item) => item.key !== props.key);
    setDataSource(newData);
    handleWareshouseList(newData);
  };

  const handleStock = useCallback(
    (index: number) => (value: number | null) => {
      const newData = [...dataSource];
      newData[index] = {
        ...newData[index],
        opening_stock: value,
      };

      setDataSource(newData);
      handleWareshouseList(newData);
    },
    [handleWareshouseList, dataSource]
  );
  const handleWarehouse = useCallback(
    (key) => (value: number) => {
      const currentOption = warehouses?.find(
        (ware: { id: number | null }) => ware.id === value
      ) as WarehouseProps;
      const newData = [...dataSource];
      //   const itemIndex = newData.findIndex((item) => item.key === row.key);
      newData[key] = {
        // key: `${key}`,
        ...newData[key],
        id: currentOption?.id,
        address: currentOption?.address,
        opening_stock: 0,
      };
      setDataSource(newData);
      handleWareshouseList(newData);
    },
    //eslint-disable-next-line
    [warehouses, dataSource]
  );

  const handleAdd = () => {
    const newData = {
      key: `${rowCount}`,
      id: null,
      address: "",
      opening_stock: 0,
    };
    setDataSource([...dataSource, newData] as WarehouseProps[]);
    setRowCount(rowCount + 1);
  };

  const memoColumns = useMemo(
    () => [
      {
        title: "Warehouse Name",
        dataIndex: "id",
        ellipsis: true,
        width: 70,
        render: (warehouse_id: number, _: object, key: number) => (
          <Selectx
            // showArrow={false}
            // getPopupContainer={(trigger) => trigger.parentElement}
            style={{ width: 250 }}
            placeholder="Select Warehouse"
            defaultValue={warehouse_id}
            handleChange={handleWarehouse(key)}
            options={warehouses.map((warehouse: WarehouseProps, index: number) => ({
              key: index,
              value: warehouse.id,
              label: warehouse.label
            }))}
            
          />
            
        ),
      },
      {
        title: "Address",
        dataIndex: "address",
        ellipsis: true,
        width: 150,
      },
      {
        title: "Opening Stock",
        dataIndex: "opening_stock",
        ellipsis: true,
        width: 50,
        render: (stock: number, _: object, key: number) => (
          <InputNumber
            type="number"
            placeholder="0"
            value={stock || 0}
            name="opening_stock"
            style={{ width: 170 }}
            onChange={handleStock(key)}
            disabled={itemDetails?.transactionInfo}
          />
        ),
      },
      {
        title: "",
        dataIndex: "",
        key: "x",
        width: 10,
        align: "center" as const,
        render: (props: { key: string | number }) => (
          <Space align="center">
            <Popconfirm
              key="confirm"
              okText="Yes"
              cancelText="No"
              placement="left"
              title={`Delete warehouse ?`}
              disabled={!!(dataSource.length === 1)}
              onConfirm={() => handleConfirm(props)}
            >
              <Button
                size="small"
                shape="circle"
                key="deletebtn"
                aria-disabled="true"
                disabled={!!(dataSource.length === 1)}
              >
                <RiDeleteBinLine size={10} />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    [warehouses, handleStock, handleWarehouse, handleConfirm]
  );
  return (
    <>
      <Table
        bordered
        size="small"
        rowKey="key"
        loading={false}
        pagination={false}
        columns={memoColumns}
        dataSource={dataSource}
        title={() => "Choose Warehouse"}
        style={{
          marginRight: "300px",
        }}
      />
      <Button onClick={handleAdd}>Add Warehouse</Button>
    </>
  );
};

export default TrackInventory;

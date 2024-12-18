/** @format */

import { useCallback, useState, useEffect } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Space, Typography } from "antd";
import { EditTax } from "./Edit";
import { CreateTax } from "./Create";
import { TaxListing } from "./Listing";
import { endpoints, Labels } from "static";
import { EditTaxGroup, CreateTaxGroup } from "./Group";
import { AccessDenied, Icons, Toast } from "app/shared";
import { useGetTaxListQuery } from "store/query/organization";
import { useAxios, useBool, usePermissions, useSearchParam } from "app/Hooks";

const { Title } = Typography;
const { TAXES, TAX_GROUP } = endpoints;
const { HiReceiptTax, VscAdd } = Icons;
const { NEW_TAX, GROUP, TAX_RATE } = Labels;

export const TaxRate = () => {
  const { checkPermission } = usePermissions();
  const { callAxios, bool, toggle } = useAxios();
  const [current, setCurrent] = useState<any>({});
  const { bool: editform, toggle: toggleEdit } = useBool();
  const { total, getParams, setTotal } = useSearchParam("");
  const { bool: deleteTax, toggle: toggleDelete } = useBool();
  const { bool: creategroup, toggle: toggleGroup } = useBool();
  const { bool: editgroup, toggle: toggleEditGroup } = useBool();
  const [currSelected, setCurrSelected] = useState<number[]>([]);
  const { has_TaxView_permission } = checkPermission("TaxView");
  const { has_TaxEdit_permission } = checkPermission("TaxEdit");
  const { has_TaxCreate_permission } = checkPermission("TaxCreate");
  const { has_TaxDelete_permission } = checkPermission("TaxDelete");

  const {
    data = {},
    refetch,
    isLoading,
  } = useGetTaxListQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_TaxView_permission,
  });

  useEffect(() => {
    setTotal(data?.total);
    //eslint-disable-next-line
  }, [data.total]);

  const handleClick = (data) => {
    setCurrent(data);
    if (!data.tax_group_details) {
      toggleEdit();
    } else {
      // setCurrSelected(data.tax_group_details.map((tx: any) => tx.tax_id));
      toggleEditGroup();
    }
  };

  const handleConfirm = (curr) => {
    toggleDelete();
    callAxios({
      method: "delete",
      url: !curr.tax_group_details ? `${TAXES}/${curr.id}` : `${TAX_GROUP}/${curr.id}`,
    }).then((res) => {
      if (res) {
        refetch();
        toggleDelete();
        toggle();
        Toast({ message: res.message });
      }
    });
  };

  const memoizeClick = useCallback(handleClick, [toggleEdit, toggleEditGroup]);
  const memoizeConfirm = useCallback(handleConfirm, [callAxios, refetch, toggleDelete, toggle]);

  return (
    <>
      <PageHeader
        title={
          <Space>
            <HiReceiptTax size={25} />
            <Title level={3}>{TAX_RATE}</Title>
          </Space>
        }
        extra={[
          <Button key="1" icon={<VscAdd size={14} />} className="pr-color add_btn" onClick={toggle}>
            {NEW_TAX}
          </Button>,
          <Button key="2" icon={<VscAdd size={14} />} className="pr-color add_btn" onClick={toggleGroup}>
            {`${NEW_TAX} ${GROUP}`}
          </Button>,
        ]}
        style={{ borderBottom: "1px solid gray", paddingBottom: "0" }}
      />
      {has_TaxView_permission ? (
        <TaxListing
          total={total}
          listing={data?.data || []}
          handleClick={memoizeClick}
          handleConfirm={memoizeConfirm}
          loading={isLoading || deleteTax}
          has_permission={has_TaxDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      <CreateTax
        bool={bool}
        toggle={toggle}
        current={current}
        refetch={refetch}
        has_permission={has_TaxCreate_permission}
      />
      <CreateTaxGroup
        refetch={refetch}
        bool={creategroup}
        toggle={toggleGroup}
        listing={data?.data || []}
        setCurrent={setCurrent}
        currSelected={currSelected}
        setCurrSelected={setCurrSelected}
        has_permission={has_TaxCreate_permission}
      />
      {editform && (
        <EditTax
          bool={editform}
          current={current}
          refetch={refetch}
          toggle={toggleEdit}
          setCurrent={setCurrent}
          has_permission={has_TaxEdit_permission}
        />
      )}
      {editgroup && (
        <EditTaxGroup
          bool={editgroup}
          refetch={refetch}
          current={current}
          setCurrent={setCurrent}
          toggle={toggleEditGroup}
          listing={data?.data || []}
          currSelected={currSelected}
          setCurrSelected={setCurrSelected}
          has_permission={has_TaxCreate_permission}
        />
      )}
    </>
  );
};

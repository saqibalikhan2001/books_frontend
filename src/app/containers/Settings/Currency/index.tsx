/** @format */

import { useCallback, useState, useEffect } from "react";
import { endpoints } from "static";
import { EditCurrency } from "./Edit";
import CurrencyListing from "./Listing";
import { CreateCurrency } from "./Create";
import { AccessDenied } from "app/shared";
import { useGetCurrencyListQuery } from "store/query/organization";
import { useAxios, useBool, useListing, usePermissions, useSearchParam } from "app/Hooks";

const { CURRENCY } = endpoints;

const Currency = () => {
  const { bool: boolean } = useBool();
  const { currncy_list } = useListing();
  const [current, setCurrent] = useState({});
  const { checkPermission } = usePermissions();
  const { handleConfirm, bool, toggle } = useAxios();
  const { total, getParams, setTotal } = useSearchParam("");
  const { has_CurrencyView_permission } = checkPermission("CurrencyView");
  const { has_CurrencyEdit_permission } = checkPermission("CurrencyEdit");
  const { has_CurrencyCreate_permission } = checkPermission("CurrencyCreate");
  const { has_CurrencyDelete_permission } = checkPermission("CurrencyDelete");
  const {
    data = {},
    isLoading,
    refetch,
  } = useGetCurrencyListQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_CurrencyView_permission,
  });

  useEffect(() => {
    setTotal(data?.total);
  }, [setTotal, data?.total]);

  const handleClick = (data: any) => {
    setCurrent(data);
    toggle();
  };

  const memoizeClick = useCallback(handleClick, [toggle]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, CURRENCY, refetch),
    //eslint-disable-next-line
    []
  );

  return (
    <>
      <CreateCurrency
        refetch={refetch}
        currncy_list={currncy_list}
        has_permission={has_CurrencyCreate_permission}
      />
      {has_CurrencyView_permission ? (
        <CurrencyListing
          total={total}
          listing={data?.data || []}
          loading={bool || isLoading}
          handleClick={memoizeClick}
          handleConfirm={memoizeConfirm}
          has_permission={has_CurrencyDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {bool && Object.keys(current).length > 0 && (
        <EditCurrency
          bool={bool}
          toggle={toggle}
          current={current}
          refetch={refetch}
          loading={boolean}
          currncy_list={currncy_list}
          has_permission={has_CurrencyEdit_permission}
        />
      )}
    </>
  );
};
export default Currency;

/** @format */

import { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { endpoints } from "static";
import { CreateReceive } from "./Create";
import { PoReceiveProps } from "./Types";
import { ReceiveListing } from "./Listing";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, useBool, usePermissions } from "app/Hooks";

const { RECEIVES } = endpoints;

const POReceive = ({ url, detail }: PoReceiveProps) => {
  const [data, setData] = useState([]);
  const { checkPermission } = usePermissions();
  const { bool, toggle: showModal } = useBool();
  const { bool: fetchList, toggle: refetch } = useBool();
  const { callAxios, toggle: loader, bool: loading } = useAxios();
  const { has_ReceiveView_permission } = checkPermission("ReceiveView");
  const { has_ReceiveDelete_permission } = checkPermission("ReceiveDelete");
  const { has_ReceiveCreate_permission } = checkPermission("ReceiveCreate");

  const handleConfirm = (data: any) => {
    callAxios({
      method: "delete",
      url: `${RECEIVES}/${data.id}`,
    }).then((res: any) => {
      if (res) {
        Toast({ message: res.message });
        refetch();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,
    //eslint-disable-next-line
    []
  );

  const handleButton = () => showModal();

  useEffect(() => {
    if (has_ReceiveView_permission) {
      loader();
      callAxios({
        url: `${url}${RECEIVES}`,
      }).then((res: any) => {
        setData(res);
        loader();
      });
    }
    //eslint-disable-next-line
  }, [url, fetchList, has_ReceiveView_permission]);

  return (
    <>
      {has_ReceiveView_permission ? (
        <>
          <ReceiveListing
            loading={loading}
            listing={data || []}
            handleConfirm={memoizeConfirm}
            has_permission={has_ReceiveDelete_permission}
          />
          <Button type="link" onClick={handleButton}>
            + New Purchase Receive
          </Button>
        </>
      ) : (
        <AccessDenied />
      )}
      {bool && (
        <CreateReceive
          bool={bool}
          refetch={refetch}
          PODetails={detail}
          closeModal={showModal}
          url={`${url}${RECEIVES}/${"create"}`}
          has_permission={has_ReceiveCreate_permission}
        />
      )}
    </>
  );
};

export default POReceive;

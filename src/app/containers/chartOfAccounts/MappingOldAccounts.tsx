/** @format */

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Modal } from "antd";
import { Labels } from "static";
import MAPAccountsForm from "./MapAccountFrom";
import { AccessDenied, Spinner } from "app/shared";
import { useAxios, useLoading, useStore } from "app/Hooks";

const MapOldAccounts = ({ bool = false, toggle = () => {}, has_permission = true }) => {
  const { role } = useStore();
  const location = useLocation();
  const { callAxios } = useAxios();
  const [data, setData] = useState();
  const [loading, , setTrue, setFalse] = useLoading();
  const [hasContentLoading, setHasContentLoading] = useState(true);

  const fetchData = () => {
    setTrue();
    callAxios({
      method: "get",
      url: "old_accounts",
    }).then((res) => {
      setFalse();
      if (res) {
        setData(res?.data);
        setHasContentLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return location?.pathname?.includes("add-accounts") ? (
    role?.name !== "Super Admin" ? (
      <InvitedUser />
    ) : (
      <MAPAccountsForm
        data={data ?? []}
        handleClose={toggle}
        hasContentLoading={hasContentLoading}
      />
    )
  ) : (
    <Modal
      centered
      open={bool}
      width={700}
      footer={null}
      destroyOnClose
      style={{ top: 0 }}
      maskClosable={false}
      title={Labels.MAP_ACCOUNT}
      className="estimate_modal estimate_md_modal generic_modal_style __map--old-acc"
      onCancel={() => {
        toggle();
      }}
      bodyStyle={{
        height: "500px",
      }}
    >
      {has_permission ? (
        <>
          {" "}
          {loading ? (
            <Spinner />
          ) : (
            <MAPAccountsForm modal data={data ?? []} handleClose={toggle} />
          )}{" "}
        </>
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};

export default MapOldAccounts;

export const InvitedUser = () => {
  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <h1>Your are invited user </h1>
      <br />
      <br />
      <p>Please ask admin to map account first to use organization</p>
    </div>
  );
};

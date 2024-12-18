//@ts-nocheck
import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Typography } from "antd";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";

export default function HasChildAccount({ data }) {
  const { callAxios } = useAxios();
  const [bool, setloading] = useState(false);
  const [has_child_account, set_has_child_account] = useState([]);

  useEffect(() => {
    if (data?.id) {
      setloading(true);
      callAxios({ url: `accounts/sub_accounts/${data?.id}` }).then((res) => {
        set_has_child_account(res);
        setloading(false);
      });
    }
  }, [data?.id]);

  return (
    <div style={{ width: "100%" }}>
      {bool ? (
        <Spinner />
      ) : (
        <>
          <div
            style={{ color: "red", fontSize: "20px", width: "80px" }}
            className="d-flex justify_between align-center"
          >
            <FiAlertTriangle />
            <Typography style={{ color: "red", fontSize: "20px" }}>Alert</Typography>
          </div>
          <Typography className="mt-20">
            {" "}
            You cannot delete this account because it has following sub-accounts:
          </Typography>
          <div className="mt-20">
            <table className="account-table" style={{ background: "red" }}>
              <thead>
                <tr>
                  <th style={{ flex: 1 }}>Account No.</th>
                  <th style={{ flex: 1 }}>Account name</th>
                  <th style={{ flex: 1 }}>Status</th>
                  <th style={{ flex: 1 }}>Level</th>
                  <th style={{ flex: 1 }}>Parent account</th>
                </tr>
              </thead>
              <tbody>
                {has_child_account?.map((account, index) => (
                  <tr key={index}>
                    <td style={{ flex: 1 }}>{account.account_no || ""}</td>
                    <td style={{ flex: 1 }}>{account.title}</td>
                    <td style={{ flex: 1 }}>{account.is_active ? "Active" : "Inactive"}</td>
                    <td style={{ flex: 1 }}>{account.account_level}</td>
                    <td style={{ flex: 1 }}>{account.parent_account_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

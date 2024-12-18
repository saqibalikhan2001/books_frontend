/** @format */

import { useNavigate } from "react-router";
import { Button } from "antd";
import { PageHeaderX } from "app/shared";

export const SubHeader = ({ customer = false }: { customer?: boolean }) => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeaderX.SubHeader
        title={
          <div className={`global_breadcrumb `}>
            <div className="back-btn">
              <Button
                type="link"
                className="btn"
                onClick={() => {
                  navigate("/reports");
                }}
              >
                <img
                  className="breadcrumb_arrow  mr-11"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/page_back.svg`}
                />
                Back
              </Button>
            </div>
            <span
              onClick={(e) => {
                e.preventDefault();
              }}
              className="header-heading"
            >
              {customer ? "Payment Receipts By Customer Report" : "Payment Receipts Report"}
            </span>
          </div>
        }
        btnText=""
        navigateTo=""
      />
    </>
  );
};

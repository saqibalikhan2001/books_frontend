/** @format */

import { useNavigate } from "react-router";
import { Button } from "antd";
import { PageHeaderX } from "app/shared";

export const SubHeader = ({ supplier = false }: { supplier?: boolean }) => {
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
              className="header-heading"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {supplier ? "Bill Payment By Supplier Report" : "Bill Payment Report"}
            </span>
          </div>
        }
        btnText=""
        navigateTo=""
      />
    </>
  );
};

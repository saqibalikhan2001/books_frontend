/** @format */

import { Button } from "antd";
import { PageHeaderX } from "app/shared";
import { useNavigate } from "react-router";

export const SubHeader = () => {
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
            <p
              onClick={(e) => {
                e.preventDefault();
              }}
              className="mb-0 pl-10"
            >
              Ar Aging Summary Report
            </p>
          </div>
        }
        btnText=""
        navigateTo=""
      />
    </>
  );
};

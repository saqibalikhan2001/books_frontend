/** @format */

import { Button } from "antd";
import { PageHeaderX } from "app/shared";
import { useLocation, useNavigate } from "react-router";

export const SubHeader = ({
                            enable = false,
                            noData = false,
                          }: {
  enable: boolean;
  noData?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state }: any = location;

  return (
    <>
      <PageHeaderX.SubHeader
        title={
          <div className={`global_breadcrumb `}>
            {state?.from === "Trial Balance" && (
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
            )}
            <span className="header-heading">Trial Balance</span>
          </div>
        }
        btnText=""
        navigateTo=""
        enabled={enable}
        show={noData}
      />
    </>
  );
};

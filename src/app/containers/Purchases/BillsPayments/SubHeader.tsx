import { useNavigate } from "react-router";
import { Button } from "antd";
import { Content } from "static";
import { PageHeaderX } from "app/shared";

const { all_bill_payments } = Content;

export const SubHeader = () => {
  const navigate = useNavigate();

  return (
    <>
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
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="header-heading"
              >
                {all_bill_payments}
              </span>
            </div>
          }
          btnText=""
          navigateTo=""
        />
      </>
      {/* <PageHeaderX.SubHeader
        btnText={""}
        navigateTo={""}
        enabled={enable}
        showButton={false}
        title={all_bill_payments}
      /> */}
    </>
  );
};

import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button } from "antd";
import { routeNames } from "static";
import { BreadcrumbxProps } from "./types";
import { getStringValueFromSS, handletoggle, setKeyInSS } from "utils";

export const Breadcrumbx = ({
  name,
  setting,
  refetch,
  category,
  className,
  detailPage,
  moduleName,
  organization,
  show = false,
  seconderyBtn,
  toggleMapModal,
  organizationName,
  handleFullScreen,
  from = "Preferences",
}: BreadcrumbxProps) => {
  const navigate = useNavigate();

  return (
    <>
      {detailPage ? (
        <div className={`global_breadcrumb back-to-deatial-mobile  ${className}`}>
          <div className="back-btn">
            <Button
              type="link"
              className="btn"
              onClick={() => {
                localStorage.removeItem("once");
                handletoggle(handleFullScreen, refetch);
              }}
            >
              <img
                className="breadcrumb_arrow  mr-11"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/page_back.svg`}
              />
              Back to {moduleName?.toLowerCase()}
            </Button>
          </div>
        </div>
      ) : (
        <div className={`global_breadcrumb  ${className}`}>
          <div className="back-btn min-width-133">
            <Button
              type="link"
              className="btn"
              onClick={async () => {
                if (category) {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    page: 1,
                  };
                  await setKeyInSS("params", params);
                  navigate("/items");
                } else navigate(-1);
              }}
            >
              <img
                className="breadcrumb_arrow  mr-10"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/page_back.svg`}
              />
              {category ? "Back to products" : "Back"}
            </Button>
          </div>
          <Breadcrumb>
            {setting && (
              <>
                <Breadcrumb.Item>Settings</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={`${routeNames.PREFERENCES}?tab=1`}>{from}</Link>
                </Breadcrumb.Item>
              </>
            )}
            <Breadcrumb.Item>{name}</Breadcrumb.Item>
            {organization && <Breadcrumb.Item>{organizationName}</Breadcrumb.Item>}
          </Breadcrumb>
          {/* {show && !seconderyBtn && (
            <div className="preference_text" style={{ marginLeft: "auto" }}>
              <Preferenceheader />
            </div>
          )} */}

          {!show && seconderyBtn && (
            <div className="preference_text" style={{ marginLeft: "auto" }}>
              <Button
                key="1"
                type="primary"
                onClick={() => toggleMapModal?.()}
                className="btn-form-size btn  d-flex align-center"
              >
                <span style={{ color: "white" }}> Map Old Account</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/**@format */

import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Space, Typography } from "antd";
import { Buttonx } from ".";
import { PageHeader } from "@ant-design/pro-layout";
import { SubHeaderProps } from "./types";

const { Title } = Typography;

export const PageHeaderX = ({ title }: { title: string; navigateTo: string }) => {
  return (
    <>
      <PageHeader
        title={
          <Space>
            <Title level={3}>{title}</Title>
          </Space>
        }
      />
    </>
  );
};

const SubHeader = ({
  title,
  btnText,
  itemsMore,
  items = [],
  navigateTo,
  itemdetails,
  toggleModal,
  show = false,
  enabled = false,
  account = false,
  showButton = true,
  primaryBtn = false,
  dropDownBtn = false,
  seconderyBtn = false,
  seconderyBtnText,
  toggleMapModal,
}: SubHeaderProps) => {
  const navigate = useNavigate();
  const menuItems = items && items;

  return (
    <>
      <PageHeader
        className="inner_component_header"
        title={<label>{title}</label>}
        extra={
          <>
            {showButton && (
              <>
                {show && (
                  <Dropdown
                    menu={{ items: itemsMore }}
                    trigger={["click"]}
                    placement="bottomRight"
                    overlayStyle={{ minWidth: 147 }}
                  >
                    <Button
                      className={`more_btn btn-default btn-form-size mr-2 ${itemdetails ? "__additem_product" : ""
                        }`}
                    >
                      More
                      <img
                        alt="dropdown"
                        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
                      />
                    </Button>
                  </Dropdown>
                )}
                {primaryBtn && (
                  <Button
                    key="1"
                    type="primary"
                    disabled={enabled}
                    icon={
                      <img
                        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                        alt="dropdown"
                        className="mr-10 image_filter"
                      />
                    }
                    onClick={() => (account ? toggleModal?.() : navigate(navigateTo))}
                    className="btn-form-size btn-primary d-flex align-center"
                  >
                    {btnText}
                  </Button>
                )}
                {seconderyBtn && (
                  <Button
                    key="1"
                    type="primary"
                    disabled={enabled}
                    onClick={() => (account ? toggleMapModal?.() : navigate(navigateTo))}
                    className="btn-form-size btn-primary d-flex align-center"
                  >
                    {seconderyBtnText}
                  </Button>
                )}
                {dropDownBtn && (
                  <div className="d-flex align-center new_prod_btn __item_module">
                    <Buttonx
                      btnText={btnText}
                      disabled={enabled}
                      clickHandler={() => navigate(navigateTo)}
                      className={"btn-form-size btn-primary px-12"}
                    />
                    <Dropdown
                      disabled={enabled}
                      trigger={["click"]}
                      menu={{ items: menuItems }}
                      overlayClassName="generic_dropdown credit-note-drop"
                      className="h-36px p-5 cursor-pointer"
                    >
                      <span
                        className={`generic-dropdown-icon ${enabled ? "disabled-svg" : "bg-blue"}`}
                      >
                        <img
                          alt="dropdown"
                          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
                        />
                      </span>
                    </Dropdown>
                  </div>
                )}
              </>
            )}
          </>
        }
      />
    </>
  );
};

PageHeaderX.SubHeader = SubHeader;

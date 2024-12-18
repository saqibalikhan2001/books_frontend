import { Dropdown, Space, MenuProps } from "antd";

const classpicker = "area";
const rendomClass: string = (Math.random() + 1).toString(36).substring(7);

export const MenuActions = ({ value }: { value: MenuProps["items"] }) => {
  const menu: MenuProps = {
    items: value,
  };
  return (
    <Space onClick={(e) => e?.stopPropagation()}>
      <div className={`${classpicker + rendomClass}`}>
        <Dropdown
          menu={menu}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName={"elepsis--dropdown"}
          getPopupContainer={() =>
            document.querySelector(`.${classpicker + rendomClass}`) || document.body
          }
        >
          <div className="ellipses_icon" onClick={(e) => e.stopPropagation()}>
            <img
              alt="ellipses Icon"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/ellipsis.svg`}
            />
          </div>
        </Dropdown>
      </div>
    </Space>
  );
};

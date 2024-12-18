/** @format */

import { Button, Popconfirm, Space } from "antd";
import { Labels } from "static";
import { Icons } from ".";
import { TooltipX } from "./ToolTip";
import { RenderActionProps } from "./types";

const { YES, NO } = Labels;
const { AiOutlineEdit, RiDeleteBinLine } = Icons;

export const RenderAction = ({
  title,
  data,
  handleClick,
  handleConfirm,
  canEdit = true,
  deletePermission = true,
}: RenderActionProps) => {
  return (
    <Space style={{ width: "100%", justifyContent: "center" }}>
      {canEdit && (
        <TooltipX key="editbtn" title="Edit">
          <Button
            size="small"
            shape="circle"
            icon={<AiOutlineEdit />}
            onClick={() => handleClick!(data)}
          />
        </TooltipX >
      )}
      <Popconfirm
        key="confirm"
        placement="left"
        title={title}
        okText={YES}
        cancelText={NO}
        onCancel={(e) => e?.stopPropagation()}
        onConfirm={(e) => {
          e?.stopPropagation();
          deletePermission && handleConfirm(data);
        }}
      >
        <Button size="small" key="deletebtn" shape="circle" onClick={(e) => e.stopPropagation()}>
          <RiDeleteBinLine />
        </Button>
      </Popconfirm>
    </Space>
  );
};

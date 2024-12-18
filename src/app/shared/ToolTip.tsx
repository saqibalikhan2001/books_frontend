import { Tooltip } from "antd";
import { ReactNode } from "react";

type tooltip_props = {
  children: ReactNode;
  placement?: "bottom" | "top" | "right" | "left" | "rightTop" | "bottomRight" | "bottomLeft";
  title: string;
  className?: string;
  overlayClassName?: string;
  overlayStyle?: any;
};

export const TooltipX = ({
  children,
  title,
  placement = "bottom",
  className = "",
  overlayClassName = "",
  overlayStyle,
}: tooltip_props) => {
  return (
    <Tooltip
      placement={placement}
      title={title}
      className={className}
      overlayClassName={overlayClassName}
      overlayStyle={overlayStyle}
      mouseLeaveDelay={0}
    >
      {children}
    </Tooltip>
  );
};

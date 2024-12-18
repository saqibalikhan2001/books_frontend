import { Link } from "react-router-dom";
import { Button, Form } from "antd";
import { ButtonProps } from "./types";

export const Buttonx = ({
  type,
  style = {},
  icon = null,
  linkTo = "",
  clickHandler,
  block = false,
  danger = false,
  className = "",
  shape = "default",
  loading = false,
  wrapperCol = {},
  disabled = false,
  btnText = "Submit",
  htmlType = "submit",
}: ButtonProps) => (
  <Form.Item wrapperCol={wrapperCol} style={style}>
    {linkTo ? (
      <Link to={linkTo}>
        <Button type={type} shape={shape} disabled={disabled} className={className}>
          {btnText}
        </Button>
      </Link>
    ) : (
      <Button
        id="closingSlector"
        type={type}
        shape={shape}
        icon={icon}
        style={style}
        block={block}
        danger={danger}
        loading={loading}
        disabled={disabled}
        htmlType={htmlType}
        className={className}
        onClick={clickHandler}
        {...(type === "dashed" && { block: true, shape: "default" })}
      >
        {btnText}
      </Button>
    )}
  </Form.Item>
);

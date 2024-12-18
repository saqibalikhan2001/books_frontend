/** @format */
import { Input, Select, Typography } from "antd";
import { useState } from "react";
import { Buttonx } from "./Button";
import { TooltipX } from "./ToolTip";

const options = [10, 20, 40, 60, 80, 100];
export const CustomPaginate = ({
  Prev,
  Next,
  paginate,
  className,
  handlePage,
  totalPages,
  handleRowSize,
}: any) => {
  const [page, setPage] = useState(parseInt(paginate.page ?? 1));

  const onBlur = () => setPage(parseInt(paginate.page ?? 1));

  return (
    <div className={className}>
      <Typography.Text>Rows</Typography.Text>
      <Select
        value={paginate.pageSize}
        onChange={handleRowSize}
        suffixIcon={
          <img
            alt="dropdown icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        }
      >
        {options.map((option) => (
          <Select.Option key={option}>{option}</Select.Option>
        ))}
      </Select>
      <Buttonx
        btnText=""
        clickHandler={Prev}
        disabled={paginate.page == 1}
        className={`${Prev ? "prevbtn" : ""}`}
        icon={
          <img
            alt="left arrow"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/left_arrow.svg`}
          />
        }
      />
      <InputNumberX
        value={page}
        onBlur={onBlur}
        onChange={setPage}
        totalPages={totalPages}
        onPressEnter={(e: any) => handlePage(e.target.value, totalPages)}
      />

      <Buttonx
        btnText=""
        clickHandler={Next}
        className={`${Next ? "nextbtn" : ""}`}
        disabled={paginate.page == totalPages}
        icon={
          <img
            alt="right arrow"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/right_arrow.svg`}
          />
        }
      />
      <TooltipX placement="bottomRight" title={`Total pages: ${totalPages}`}>
        <Typography.Text className="total-pages">of&nbsp; {totalPages ?? 100}</Typography.Text>
      </TooltipX>
    </div>
  );
};

const InputNumberX = ({
  id = "paginate-number",
  value,
  onChange,
  onPressEnter,
  totalPages,
  onBlur,
}: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const regInteger = /^[0-9]+$/;
    if (regInteger.test(inputValue) || inputValue === "") {
      const newValue = inputValue ? parseInt(inputValue) : inputValue;
      newValue === 0
        ? onChange(1)
        : newValue > totalPages
        ? onChange(totalPages)
        : onChange(newValue);
    }
  };
  return (
    <Input
      id={id}
      value={value}
      onBlur={onBlur}
      onChange={handleChange}
      onPressEnter={onPressEnter}
      // onFocus={() => {
      //   const element = document.getElementById(`${id}`);
      //   setTimeout(() => {
      //     //@ts-ignore
      //     element?.select();
      //   }, 10);
      // }}
    />
  );
};

/** @format */
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";
import { BooksLoader } from "./BooksLoader";

const override = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: red;
  height: 100%;
`;

export const PageLoader = () => (
  <BeatLoader color="green" css={override} size={25} margin={12} loading />
);

export const Spinner = ({
  size = "100px",
  directionSize = "100%"
}: {
  size?: any;
  directionSize?:any
}) => {
  return (
    // <div className="_spinner" style={{ height: directionSize ? directionSize : "100%" }}>
      <BooksLoader size={size} directionSize={directionSize} />
    // </div>
  );
};

export const SpinnerX = ({
  size = "100px",
  directionSize = "100%"
}: {
  size?: any;
  directionSize?:any
}) => {
  return (
    <div className="_spinner" style={{ height: '92.5vh' }}>
      <BooksLoader size={size} directionSize={directionSize} />
     </div>
  );
};

/** @format */

import { PageHeaderX } from "app/shared";

export const SubHeader = ({
  enable = false,
  noData = false,
}: {
  enable: boolean;
  noData?: boolean;
}) => {
  return (
    <>
      <PageHeaderX.SubHeader
        show={noData}
        enabled={enable}
        title={"Reports"}
        btnText={""}
        navigateTo={""}
      />
    </>
  );
};

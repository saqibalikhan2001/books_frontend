/** @format */

import { PageHeaderX } from "app/shared";

export const SubHeader = ({
  toggleModal,
  toggleMapModal,
  enable = false,
}: {
  enable: boolean;
  noData?: boolean;
  toggleModal?: any;
  toggleMapModal?: any;
}) => {
  return (
    <>
      <PageHeaderX.SubHeader
        account
        primaryBtn
        enabled={enable}
        navigateTo={"/"}
        title={"Accounts"}
        seconderyBtn={false}
        btnText="New Account"
        toggleModal={toggleModal}
        toggleMapModal={toggleMapModal}
        seconderyBtnText="Map Old Account"
      />
    </>
  );
};

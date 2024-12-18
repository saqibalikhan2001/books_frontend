/** @format */

import { PageHeaderX } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { NEW_PACKAGE } = Labels;
const { all_packages } = Content;
const { ADD_PACKAGE } = routeNames;

export const SubHeader = ({ enable = false }: { enable: boolean }) => {
  return (
    <>
      <PageHeaderX.SubHeader
        enabled={enable}
        title={all_packages}
        btnText={NEW_PACKAGE}
        navigateTo={ADD_PACKAGE}
      />
    </>
  );
};

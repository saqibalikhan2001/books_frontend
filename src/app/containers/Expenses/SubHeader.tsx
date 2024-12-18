/** @format */

import { PageHeaderX } from "app/shared";
import { Content, Labels, routeNames } from "static";

const { expense } = Content;
const { NEW_EXPENSE } = Labels;
const { ADD_EXPENSE } = routeNames;

export const SubHeader = () => {
  return (
    <>
      <PageHeaderX.SubHeader primaryBtn title={expense} btnText={NEW_EXPENSE} navigateTo={ADD_EXPENSE} />
    </>
  );
};

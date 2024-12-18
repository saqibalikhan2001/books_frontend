/** @format */

import { useEffect, useState } from "react";
import { endpoints } from "static";
import { CategoryModal } from "./Modal";
import { createCategoriesProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";

const { PRODUCT_CATEGORY } = endpoints;

export const CategoryEdit = ({
  refetch,
  current,
  isModalOpen,
  setIsModalOpen,
}: createCategoriesProps) => {
  const [details, setDetails] = useState();
  const { callAxios, bool, toggle } = useAxios();
  const [formLoading, setFormLoading] = useState(true);

  const { checkPermission } = usePermissions();
  const { has_CategoryEdit_permission } = checkPermission("CategoryEdit");
  useEffect(() => {
    if (current && Object.keys(current).length) {
      setFormLoading(true);
      callAxios({
        method: "get",
        url: `${PRODUCT_CATEGORY}/${current?.id}/edit`,
      }).then((res) => {
        if (res) {
          setDetails(res);
          Toast({ message: res.message });
          toggle();
          setFormLoading(false);
        }
      });
    }
    //eslint-disable-next-line
  }, [current]);

  const onSubmit = (values) => {
    const data = {
      name: values.name,
      description: values.description,
    };
    toggle();
    callAxios({
      data: data,
      method: "put",
      url: `${PRODUCT_CATEGORY}/${current?.id}`,
    }).then((res) => {
      if (res) {
        setIsModalOpen(false);
        Toast({ message: res.message });
        refetch();
      }
    });
  };

  return (
    <>
      {has_CategoryEdit_permission ? (
        <CategoryModal
          edit
          loading={bool}
          current={details}
          onSubmit={onSubmit}
          isModalOpen={isModalOpen}
          formLoading={formLoading}
          setIsModalOpen={setIsModalOpen}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

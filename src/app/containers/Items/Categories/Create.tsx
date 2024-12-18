/** @format */

import { Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { CategoryModal } from "./Modal";
import { endpoints } from "static/routes";
import { CategoriesSubmit, createCategoriesProps } from "./Types";

const { ADD_CATEGORY } = endpoints;

export const CreateCategory = ({
  refetch,
  isFetching,
  isModalOpen,
  setIsModalOpen,
  itemform = false,
  handleCategory,
}: createCategoriesProps) => {
  const { callAxios, toggle, bool } = useAxios();

  const onSubmit = (values: CategoriesSubmit) => {
    toggle();
    const data = {
      name: values.name,
      description: values.description,
    };
    callAxios({
      data,
      method: "post",
      url: ADD_CATEGORY,
    }).then((res: any) => {
      if (res) {
        setIsModalOpen(false);
        itemform && handleCategory?.(res.data);
        Toast({ message: res.message });
        refetch();
      }
    });
  };

  return (
    <CategoryModal
      loading={bool}
      toggle={toggle}
      onSubmit={onSubmit}
      isFetching={isFetching}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

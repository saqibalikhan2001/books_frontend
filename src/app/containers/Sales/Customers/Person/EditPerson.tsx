/** @format */

import { Toast } from "app/shared";
import { endpoints } from "static";
import AddPerson from "./AddPerson";
import { useAxios, useCreateFormApi } from "app/Hooks";
import { EditPersonProps } from "../Types";

const { EDIT, PERSONS } = endpoints;

export const EditPerson = ({
  url,
  bool,
  detail,
  toggle,
  current,
  modalOpen,
  setDetails,
  handleModal,
}: EditPersonProps) => {
  const { callAxios } = useAxios();
  const { details } = useCreateFormApi(`${url}${PERSONS}/${current?.id}${EDIT}`);

  const onSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      data: values,
      url: `${url}${PERSONS}/${current?.id}`,
    }).then((res) => {
      if (res?.contact_person) {
        setDetails({
          ...detail,
          contact_persons: res.contact_person,
        });
        toggle();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <AddPerson
        bool={bool}
        current={details}
        onSubmit={onSubmit}
        modalOpen={modalOpen}
        handleModal={handleModal}
      />
    </>
  );
};

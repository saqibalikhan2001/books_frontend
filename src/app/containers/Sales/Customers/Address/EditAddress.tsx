/** @format */

import { Toast } from "app/shared";
import { endpoints } from "static";
import AddAddress from "./AddAddress";
import { EditAddressProps } from "../Types";
import { useAxios, useCreateFormApi } from "app/Hooks";

const { EDIT, ADDRESSES } = endpoints;

export const EditAddress = ({
  url,
  detail,
  toggle,
  current,
  modalOpen,
  setDetails,
  handleModal,
}: EditAddressProps) => {
  const { callAxios, bool, toggle: toggleLoader } = useAxios();
  const { details } = useCreateFormApi(`${url}${ADDRESSES}/${current?.id}${EDIT}`);

  const onSubmit = (values) => {
    toggleLoader();
    callAxios({
      method: "put",
      data: values,
      url: `${url}${ADDRESSES}/${current?.id}`,
    }).then((res) => {
      if (res?.contact_address) {
        setDetails({
          ...detail,
          contact_addresses: res.contact_address,
        });
        toggle();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <AddAddress
        bool={bool}
        current={details}
        onSubmit={onSubmit}
        modalOpen={modalOpen}
        handleModal={handleModal}
      />
    </>
  );
};

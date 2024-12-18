/**@format */

import { useAxios } from "app/Hooks";
import { Toast } from "app/shared";
import { ShipmentModal } from "./Modal";
import { getFullDateAndTime } from "utils";

export const CreateShipment = ({ url, bool, toggleModal, package_id, refetch }: any) => {
  const { callAxios, toggle: loader, bool: loading } = useAxios();
  const onSubmit = (values: any) => {
    loader();
    callAxios({
      method: "post",
      url: "/shipments",
      data: {
        ...values,
        package_id,
        shipment_no: values?.shipmentNo,
        shipment_date: getFullDateAndTime(values.shipment_date),
      },
    }).then((res: any) => {
      loader();
      if (res) {
        Toast({ message: res.message });
        toggleModal();
        refetch();
      }
    });
  };
  return (
    <>
      <ShipmentModal
        url={url}
        showModal={bool}
        loading={loading}
        onSubmit={onSubmit}
        toggleModal={toggleModal}
      />
    </>
  );
};

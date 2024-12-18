/**@format */

import RegisterOrganization from "./Register";
import { useStore, useDefaultOrganization } from "app/Hooks";

const UpdateOrganization = () => {
  const { organization_id } = useStore();
  const { refetch } = useDefaultOrganization(!organization_id);

  return (
    <>
      <RegisterOrganization edit refetch={refetch} />
    </>
  );
};

export default UpdateOrganization;

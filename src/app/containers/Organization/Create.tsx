/** @format */

import RegisterOrganization from "./Register";
import { useGetOrganizationsQuery } from "store/query/organization";
import { useStore } from "app/Hooks";

const CreateOrganization = () => {
  const { organization_id = "" } = useStore();
  const { refetch } = useGetOrganizationsQuery("", { skip: !organization_id });

  return (
    <>
      <RegisterOrganization refetch={refetch} />
    </>
  );
};

export default CreateOrganization;

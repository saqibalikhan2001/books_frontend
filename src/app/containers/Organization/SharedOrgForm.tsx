/** @format */

import { Fragment } from "react";
import { Checkbox, Collapse, Space } from "antd";
import { Buttonx } from "app/shared";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useGetGeneralModulesQuery } from "store/query/organization";

const { Panel } = Collapse;
// const { UNSHARE_ORGANIZATION } = endpoints;

const SharedOrgForm = ({
  share,
  setOrdid,
  setModule,
  handlesubmit,
  organizations,
}: // modules = [],
any) => {
  const { data: general_modules = [] } = useGetGeneralModulesQuery("");
  const selectModule = (checkedValues: CheckboxValueType[]) => {
    setModule(checkedValues);
  };

  const filters = organizations?.[0]?.module_permissions?.filter((val) => val.status) || [];
  const mds = [...general_modules];

  const modules = filters.length ? mds.map((val) => ({ ...val, status: false })) : mds;
  general_modules.forEach((val, i) =>
    filters?.forEach((md) => {
      if (md.general_modules_id === val.id) {
        modules[i] = {
          ...modules[i],
          status: true,
        };
      }
    })
  );

  const onChange = (checkedValues: string | string[]) => setOrdid(Number(checkedValues));
  // const handleUnShare = (id: number) => {
  //   console.log({ id });
  //   Toast({ message: "Unshare organization in progress", type: "info" });
  //   callAxios({
  //     method: "delete",
  //     url: `${UNSHARE_ORGANIZATION}/${id}`,
  //   }).then(() => {
  //     Toast({ message: "Organization UnShared Successfully." });
  //   });
  //   After unshare if not orgs(books/ims,books) then user navigate to create organization route
  //   if orgs availabe after unshare then very first which is book/ims,books
  //   will be orgs where user automatically switched into it.
  // };

  return (
    <>
      <Collapse accordion onChange={onChange}>
        {organizations?.map((val) => (
          <Panel header={val.name} key={val.id}>
            <Collapse accordion>
              <Panel header={`Organization '${val.name}' Modules`} key={`{val.id}-${val.name}`}>
                <Checkbox.Group
                  defaultValue={[...modules?.filter((val) => val.status).map((val) => val.name)]}
                  style={{ width: "100%" }}
                  onChange={selectModule}
                >
                  {modules?.map((module) => (
                    <Fragment key={module.id}>
                      <Checkbox value={module.name}>{module.name}</Checkbox>
                      <br />
                    </Fragment>
                  ))}
                </Checkbox.Group>
                <Space>
                  <Buttonx
                    type="link"
                    disabled={share}
                    btnText="Share"
                    clickHandler={handlesubmit}
                  />
                </Space>
              </Panel>
            </Collapse>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default SharedOrgForm;

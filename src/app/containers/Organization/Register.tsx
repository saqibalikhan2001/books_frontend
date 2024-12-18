/** @format */

import { useState, useCallback, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "app/shared";
import { useTypedDispatch } from "store";
import { RegisterForm } from "./RegisterForm";
import { endpoints, routeNames } from "static";
import { RegisterOrganizationProps, RegisterSubmitProps } from "./Types";
import { setDetails, currentUserRole, setOrganization } from "store/slices/authSlice";
import { editOrganization, createOrganization } from "store/slices/OrganizationSlice";
import { useAxios, useStore, useGetSearchParam } from "app/Hooks";

import "@fontsource/ibm-plex-sans";
import { BaseCurrecnyProps } from "../Sales/Types";

const { DASHBOARD, ORGANIZATION_LISTING } = routeNames;

const RegisterOrganization = ({
  edit = false,
  refetch = () => null,
  toggleModel = () => null,
}: RegisterOrganizationProps) => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const { param } = useGetSearchParam("org");
  const [, startTransition] = useTransition();
  const { callAxios, bool, toggle } = useAxios();
  const [current, setCurrent] = useState({ step: 1, percent: 20 });
  const { organization_id: org_id, users_organizations } = useStore();
  const [globalCurrencyId, setGlobalCurrencyId] = useState<BaseCurrecnyProps>();
  const [info, setInfo] = useState({
    name: "",
    logo: "",
    license_no: "",
    date_format: "",
    country_id: "",
    base_currency: "",
    company_street: "",
    is_llc: "",
    fiscal_year_id: "",
    organization_type_id: "",
    inventory_start_date: "",
    time_zone: "America/Los_Angeles",
  });

  const getGlobalCurrencyId = useCallback((id) => setGlobalCurrencyId(id), []);

  const next = useCallback(
    () => {
      startTransition(() => {
        setCurrent((prev) => ({
          percent: prev.percent + 20,
          step: current.step + 1,
        }));
      });
    },
    //eslint-disable-next-line
    [{ ...current }]
  );
  const prev = useCallback(
    () =>
      setCurrent((prev) => ({
        percent: prev.percent - 20,
        step: current.step - 1,
      })),
    //eslint-disable-next-line
    [{ ...current }]
  );

  const onSubmit = (values: RegisterSubmitProps) => {
    if (!users_organizations.length && current.step < 5) {
      setInfo({ ...info, ...values });
      return next();
    }
    toggle();
    let data = new FormData();
    let res;

    if (edit) {
      res = {
        ...info,
        ...values,
        currency_updated: JSON.stringify(!Boolean(globalCurrencyId === values.base_currency_id)),
        logo: users_organizations.length ? values.logo : info.logo || "",
      };
    } else {
      res = {
        ...info,
        ...values,
      };
    }
    for (const key in res) {
      data.append(key, res[key] || "");
    }
    let is_photochange = !!values.logo?.path;

    data.append("date_format", "long6");
    data.append("date_seprator", "/");
    data.append("number_type", values.number_type ?? 1);
    data.append("isPhotoChange", JSON.stringify(Boolean(is_photochange)));
    data.append(
      "is_logo_deleted",
      JSON.stringify(!Boolean(users_organizations.length ? values.logo : info.logo))
    );
    data.append(
      "logo",
      users_organizations.length && values.logo !== null ? values.logo : info.logo || ""
    );
    users_organizations.length && data.append("fiscal_year_id", 1 as any);

    if (edit) {
      dispatch(
        editOrganization({
          data,
          method: "post",
          url: `${endpoints.ORGANIZATIONS}/${param}`,
          isJsonType: false,
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            refetch?.();
            setTimeout(() => {
              toggle();
              navigate(ORGANIZATION_LISTING);
              Toast({ message: res.message });
            }, 1000);
          }
        });
    } else {
      dispatch(
        createOrganization({
          data,
          method: "post",
          url: endpoints.CREATE_ORGANIZATION,
          isJsonType: false,
        })
      )
        .unwrap()
        .then((res) => {
          toggle();
          if (res) {
            callAxios({
              url: endpoints.USER_PROFILE,
            }).then((res) => {
              dispatch(setDetails(res));
            });

            if (!org_id) {
              dispatch(setOrganization(res.data.id));
              dispatch(
                currentUserRole({
                  url: endpoints.CURRENT_USER_ROLE,
                })
              );
            }
            if (param === "create") {
              refetch?.();
            }
            Toast({ message: res.message });
            navigate(param === "create" ? ORGANIZATION_LISTING : DASHBOARD, {
              state: { permissionModal: true },
            });
          }
          toggleModel?.();
        })
        .catch(() => toggle());
    }
  };

  return (
    <>
      <RegisterForm
        edit={edit}
        prev={prev}
        loading={bool}
        current={current}
        onSubmit={onSubmit}
        getGlobalCurrencyId={getGlobalCurrencyId}
      />
    </>
  );
};

export default RegisterOrganization;

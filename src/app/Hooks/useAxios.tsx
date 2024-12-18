/** @format */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "app/shared";
import { axiosCall } from "services";
import { AxiosParams } from "./Types";
import { useBool } from "./useBoolean";
import { getKeyFromSS, setSessionAndLocalObj, ssoLogoutPath } from "../../utils";
import { endpoints, routeNames } from "static";
//@ts-ignore
import { Logout, currentUserRole, setDetails } from "store/slices/authSlice";
import { RESET_STATE_ACTION_TYPE } from "store/action/resetState";
import { RootState, useTypedDispatch, useTypedSelector } from "store";

const { LOGIN } = routeNames;
const { LOGOUT } = endpoints;

export const useAxios = () => {
  const navigate = useNavigate();
  const { bool, toggle } = useBool();
  const dispatch = useTypedDispatch();
  const sso_logout_url = ssoLogoutPath();
  const {
    organization_id,
    token: { access_token },
  } = useTypedSelector(({ authReducer }: RootState) => authReducer);

  const memoizeAxios = ({
    method,
    data,
    url,
    isJsonType = true,
    org = null,
    deploymentTime = false,
  }: AxiosParams) =>
    axiosCall({
      method,
      data,
      url,
      isJsonType,
      headers: {
        authorization: access_token,
        organization: org || organization_id,
      },
      deploymentTime,
    })
      .then((res: any) => {
        toggle();
        return res;
      })
      .catch((error: any) => {
        toggle();
        if (error) {
          const { status, data } = error;
          if (status === 404) return Toast({ message: error.data.message, type: "error" });
          if (status === 403) {
            const status = data.status;
            if (status === "access_denied") {
              // Toast({
              //   message:
              //     "Admin has changed the permissions. Forcefully Refreshing to load latest set permissions for you.",
              //   type: "info",
              // });

              // this part comment for testing perpose by afzaal
              callAxios({
                url: endpoints.USER_PROFILE,
              }).then((res) => {
                res && dispatch(setDetails(res));
                dispatch(currentUserRole({ url: endpoints.CURRENT_USER_ROLE }));
              });

              // setTimeout(() => {
              //   location.reload();
              // }, 1500);
              // this part comment for testing perpose by afzaal
            }
            if (status === "logout") {
              // if sso enable, redirect to sso logout
              if (import.meta.env.VITE_SSO_ENABLE === "true") {
                window.location.href = sso_logout_url;
              }
              // else below code is working
              else {
                dispatch(Logout({ url: LOGOUT }))
                  .unwrap()
                  .then((res) => {
                    if (res) {
                      dispatch({ type: RESET_STATE_ACTION_TYPE });
                      localStorage.clear();
                      navigate(LOGIN, { replace: true });
                      Toast({
                        message: error.data.message,
                        type: "info",
                      });
                    }
                  });
              }
            }
            return Toast({ message: error.data.message, type: "error" });
          }
          // if (status === 422) return Toast({ message: error.data.message, type: "error" });
          if (status === 401) {
            // if sso enable, redirect to sso logout
            if (import.meta.env.VITE_SSO_ENABLE === "true") {
              window.location.href = sso_logout_url;
            }
            // else below code is working
            else {
              dispatch(Logout({ url: LOGOUT }))
                .unwrap()
                .then((res) => {
                  if (res) {
                    dispatch({ type: RESET_STATE_ACTION_TYPE });
                    localStorage.clear();
                    navigate(LOGIN, { replace: true });
                    Toast({
                      message: error.data.message,
                      type: "info",
                    });
                  }
                });
            }
          }
        }

        return Promise.reject(error);
      });

  const callAxios = useCallback(
    memoizeAxios,
    //eslint-disable-next-line
    [organization_id, access_token]
  );

  const handleConfirm = (
    curr: any,
    url: string,
    refetch: () => void,
    data?: any,
    moduleName?: string,
    paginate?: any,
    setparam?: any,
    detail?: any,
    setDetail?: any
  ) => {
    const dataFromLS = JSON.parse(getKeyFromSS("obj"));
    const currentIndex = data?.findIndex((d) => d?.id === curr?.id);
    toggle();
    callAxios({
      method: "delete",
      url: `${url}/${curr.id || curr.payment_no}`,
    }).then((res: any) => {
      if (res) {
        if (curr?.id === detail?.id) setDetail?.(null);
        Toast({ message: res.message });
        refetch();
        if (data?.length > 1) {
          setSessionAndLocalObj(
            data[currentIndex + 1]?.id ? data[currentIndex + 1]?.id : data[currentIndex - 1]?.id,
            dataFromLS?.once ? dataFromLS?.once : false,
            moduleName || "",
            null,
            null
          );
        } else {
          if (paginate?.page === 1) {
            setSessionAndLocalObj("", false, moduleName || "", null, null);
          } else {
            setparam({
              ...paginate,
              page: paginate?.page - 1,
            });
            setSessionAndLocalObj(
              "",
              dataFromLS?.once ? dataFromLS?.once : false,
              moduleName || "",
              null,
              null
            );
          }
          // handletoggle(handleFullScreen);
        }
      }
    });
  };

  return {
    callAxios,
    bool,
    toggle,
    handleConfirm,
    organization_id,
  };
};

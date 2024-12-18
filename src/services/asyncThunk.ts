import axios from "axios";
import { _instance } from "./axiosInstance";
import { setDeploymentTime } from "utils/deploymentTimeHelper";

interface params {
  method: "post" | "get" | "patch" | "put" | "delete";
  data: object;
  url: string;
  isJsonType: boolean;
  isAuth: boolean;
  headers: object;
  cookieToken?: string;
  from?: string;
  deploymentTime?: boolean;
}

export const axiosCall = async ({
  data = {},
  method = "get",
  url,
  isJsonType = true,
  headers = {},
  deploymentTime = false,
}: Partial<params>) => {
  try {
    const response = await _instance({
      method,
      url,
      data,
      headers: {
        "Content-Type": isJsonType ? "application/json" : "multipart/form-data",
        ...headers,
      },
    });
    if (deploymentTime) {
      try {
        const responseData = await axios.get("/deploymentTime", {
          baseURL: import.meta.env.VITE_SERVER_URL,
          headers: {
            "Content-Type": isJsonType ? "application/json" : "multipart/form-data",
            ...headers,
          },
        });
        setDeploymentTime(responseData?.data);
      } catch (error) {
        console.error("Error in deploymentTime call:", error);
      }
    }
    return response.data;
  } catch (error: any) {
    return Promise.reject(error.response);
  }
};

export const apiCall = async (
  {
    data = {},
    method = "get",
    url,
    isJsonType = true,
    isAuth = true,
    cookieToken = "",
    from = "",
    deploymentTime,
  }: Partial<params>,
  ThunkApi: any
) => {
  try {
    const { authReducer } = ThunkApi.getState();
    const headers = {
      ...(!isAuth && from
        ? {
            authorization: cookieToken ? cookieToken : authReducer.token.access_token,
          }
        : {
            organization:
              authReducer.organization_id || authReducer.details?.data?.current_organization_id,
            authorization: authReducer.token.access_token,
          }),
    };
    return await axiosCall({
      url,
      data,
      method,
      isAuth,
      headers,
      isJsonType,
      deploymentTime,
    });
  } catch (error: any) {
    return Promise.reject(ThunkApi.rejectWithValue(error.data));
  }
};

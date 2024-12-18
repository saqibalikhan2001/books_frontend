import Cookies from "universal-cookie";

const cookies = new Cookies();

export const removeKeyFromLS = (key: string) => {
  return localStorage.removeItem(key);
};
export const deleteKeyFromLS = (key: string) => {
  return localStorage.removeItem(key);
};
export const removeKeyFromSS = (key: string) => {
  return sessionStorage.removeItem(key);
};

export const getStringValueFromSS = (key: string) => {
  const value = sessionStorage.getItem(key);
  return JSON.stringify(value);
};
export const getStringValueFromLS = (key: string) => {
  const value = localStorage.getItem(key);
  return JSON.parse(value as any);
};
export const setValueInLS = (key: string, value: boolean | string | number) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const setKeyInSS = (key: string, value: boolean | string | number) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};
export const getIntValueFromLS = (key: string) => {
  const value = Number(localStorage.getItem(key));
  return value;
};
export const getIntValueFromSS = (key: string) => {
  const value = Number(sessionStorage.getItem(key));
  return value;
};
export const getBooleanValueFromLS = (key: string) => {
  const value = Boolean(localStorage.getItem(key));
  return value;
};
export const getBooleanValueFromSS = (key: string) => {
  const value = JSON.parse(sessionStorage.getItem(key) as any);
  return value;
};

export const getKeyFromSS = (key: string) => {
  const value = JSON.parse(sessionStorage.getItem(key) as string);
  return value;
};

export const setKeyInLS = (key: string, value: string | number | boolean) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getKeyFromLS = (key: string) => {
  const value = JSON.parse(localStorage.getItem(key) as string);
  return value;
};

export const setSessionAndLocalObj = (
  id: number | string,
  once: boolean,
  moduleName: string,
  prev_id?: number | null,
  next_id?: number | null
) => {
  let obj = {
    once: once,
    curr_id: id,
    prev_id: prev_id || null,
    next_id: next_id || null,
    module_name: `${moduleName}`,
  };
  setKeyInSS("once", once);
  setKeyInSS("obj", JSON.stringify(obj));
  localStorage.setItem("obj", JSON.stringify(obj));
  localStorage.setItem("once", JSON.stringify(once));
};

export const setInvitationToken = (token: string) => {
  cookies.set("invitation_token", token, {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
};

export const getCookieToken = () => cookies.get("invitation_token");
export const getcookietoken = () => cookies.get("token");
export const getcookieUserStaus = () => cookies.get("user_status");
export const getcookieAccountStatus = () => cookies.get("account_status");

export const removeCookieToken = () =>
  cookies.remove("invitation_token", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });

export const removeCookies = () => {
  cookies.remove("invitation_token", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
  cookies.remove("user_status", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
  cookies.remove("token", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
  cookies.remove("refreshToken", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
  cookies.remove("rememberMe", {
    path: "/",
    domain: `${import.meta.env.VITE_COOKIEPARENT}`,
  });
};

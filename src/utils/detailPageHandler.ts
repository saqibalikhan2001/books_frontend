import { deleteKeyFromLS, setKeyInLS, setKeyInSS } from "./Storage";

export const handletoggle = (handleFullScreen, refetch?: () => void) => {
  refetch?.();
  deleteKeyFromLS("once");
  deleteKeyFromLS("tab_key");
  deleteKeyFromLS("id");
  deleteKeyFromLS("obj");
  sessionStorage.removeItem("once");
  sessionStorage.removeItem("obj");
  sessionStorage.removeItem("email");
  handleFullScreen(false);
};
export const handleTabChange = (value: string) => {
  setKeyInSS("tab_key", value);
  setKeyInLS("tab_key", value);
};

/** @format */

import { createContext, useContext, useState } from "react";
interface IProps {
  token: string;
  username: string;
  email: string;
  setToken: (token: any) => void;
}

const AuthContext = createContext<Partial<IProps>>({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [userInfo] = useState<Partial<IProps>>({
    //@ts-ignore
    setToken,
  });

  const [loading] = useState(false);
  // create method to set auth context value after login/signup

  return (
    <AuthContext.Provider value={{ ...userInfo }}>{!loading && children}</AuthContext.Provider>
  );
};

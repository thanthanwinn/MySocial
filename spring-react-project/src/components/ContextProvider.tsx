// ContextProvider.tsx
import { createContext, useState, ReactNode, useContext } from 'react';
import { UserInfoDto } from '../ds/dto';

export const UserContext = createContext<{
  userInfo: UserInfoDto | null;
  setUserInfo: (userInfo: UserInfoDto | null) => void;
}>({
  userInfo: null,
  setUserInfo: () => {},
});

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfoDto | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserContext);
import { useContext, createContext, ReactNode, useState } from "react";
import usersApi from "../apis/users";

interface AuthContextType {
  login: (input: LoginInput) => Promise<void>;
}

interface LoginInput {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export default function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<any>(null);

  const login = async (input: LoginInput) => {
    const loginRes = await usersApi.userLogin(input);
    console.log(loginRes.data);
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}

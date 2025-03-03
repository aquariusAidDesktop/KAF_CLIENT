import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { logoutUser, setUser } from "@/shared/redux/slices/userSlice";

export function useAuth() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );
    } else {
      throw new Error(data.error || "Ошибка входа");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );
    } else {
      throw new Error(data.error || "Ошибка регистрации");
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return { user, login, register, logout };
}

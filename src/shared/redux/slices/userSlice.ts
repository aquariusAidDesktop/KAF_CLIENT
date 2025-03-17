import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  isAuthenticated: boolean;
  id: string | null;
  name: string | null;
  email: string | null;
  token: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  id: null,
  name: null,
  email: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state: UserState,
      action: PayloadAction<Omit<UserState, "isAuthenticated">>
    ) {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", action.payload.token ?? "");
      }
    },
    logoutUser(state: UserState) {
      state.isAuthenticated = false;
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    loadUserFromStorage(state: UserState) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("user");
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        } else {
          console.warn("Токен не найден в localStorage");
        }
      }
    },
  },
});

export const { setUser, logoutUser, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;

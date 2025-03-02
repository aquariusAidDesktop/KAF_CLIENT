import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
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
    setUser(state, action: PayloadAction<Omit<UserState, "isAuthenticated">>) {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logoutUser(state) {
      state.isAuthenticated = false;
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;

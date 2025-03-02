export const authService = {
  register: async (name: string, email: string, password: string) => {
    return new Promise<{
      id: string;
      name: string;
      email: string;
      token: string;
    }>((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.find((user: any) => user.email === email)) {
          return reject(new Error("Email already registered"));
        }

        const newUser = {
          id: crypto.randomUUID(),
          name,
          email,
          token: crypto.randomUUID(),
        };
        users.push({ ...newUser, password });
        localStorage.setItem("users", JSON.stringify(users));
        resolve(newUser);
      }, 1000);
    });
  },

  login: async (email: string, password: string) => {
    return new Promise<{
      id: string;
      name: string;
      email: string;
      token: string;
    }>((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (user: any) => user.email === email && user.password === password
        );
        if (!user) {
          return reject(new Error("Invalid credentials"));
        }
        resolve({
          id: user.id,
          name: user.name,
          email: user.email,
          token: user.token,
        });
      }, 1000);
    });
  },

  logout: async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};

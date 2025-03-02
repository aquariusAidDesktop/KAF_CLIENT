export const authService = {
  register: async (name: string, email: string, password: string) => {
    // Получаем список пользователей или инициализируем пустой массив
    const usersStr = localStorage.getItem("users") || "[]";
    const users = JSON.parse(usersStr);

    // Проверяем, существует ли уже пользователь с таким email
    if (users.some((user: any) => user.email === email)) {
      throw new Error("Email already registered");
    }

    // Создаём нового пользователя с уникальными идентификаторами
    const newUser = {
      id: crypto.randomUUID(), // Современные браузеры поддерживают crypto.randomUUID()
      name,
      email,
      token: crypto.randomUUID(),
      password, // В продакшене пароль необходимо хэшировать!
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Возвращаем данные без пароля
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: newUser.token,
    };
  },

  login: async (email: string, password: string) => {
    const usersStr = localStorage.getItem("users") || "[]";
    const users = JSON.parse(usersStr);

    // Ищем пользователя с совпадающими email и password
    const user = users.find(
      (user: any) => user.email === email && user.password === password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: user.token,
    };
  },

  logout: async () => {
    // Здесь можно добавить дополнительную логику очистки сессии, если необходимо
    return;
  },
};

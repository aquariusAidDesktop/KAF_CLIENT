# Используем Node.js 22 LTS на Ubuntu
FROM node:22.14.0

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем PNPM
RUN corepack enable

# Обновляем пакеты и устанавливаем зависимости
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y \
    ffmpeg \
    libstdc++6 \
    libc6 \
    libasound2 \
    sox \
    tzdata \
    --fix-missing && \
    rm -rf /var/lib/apt/lists/*

# Копируем package.json и pnpm-lock.yaml перед установкой зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Пересобираем Vosk, если требуется
# RUN pnpm rebuild vosk || true

# Копируем весь код проекта
COPY . .

# Собираем приложение (если нужно)
# RUN pnpm build

# Указываем команду запуска
CMD ["pnpm", "dev"]

# Открываем порт 3000
EXPOSE 3000

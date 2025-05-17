# Установка

## Требования
- **Система**:
  - Рекомендуется: Ubuntu 24.04 / Linux Mint 22 с Docker.
  - Альтернативы: Windows 10/11 (WSL2, Docker Desktop), macOS 15.0/14.7 (Docker Desktop).
- **Зависимости**:
  - Node.js v22+
  - npm v9+
  - Docker, Docker Compose
  - PostgreSQL 17 (Docker для разработки)
- **Инструменты**:
  - IntelliJ IDEA / PhpStorm / WebStorm.
  - Альтернатива: VS Code + DBeaver.

## Пошаговая инструкция
1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/okawar/areal-hr_ext-test.git
   cd areal-hr-test

2. **Настройте .env**:
    ```bash 
    cp .env.example .env

**Пример .env:**:
    
```bash 
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=your_password
  POSTGRES_DB=areal-hr_ext-test
  POSTGRES_HOST=localhost
  POSTGRES_PORT=5432

  APP_URL=http://localhost
  VITE_APP_PORT_SERVER=5001

  VITE_APP_URL=http://localhost
  VITE_APP_PORT=5173

  VITE_API_BASE_URL_LOCAL=http://localhost:5001
  VITE_API_BASE_URL=/

  DATABASE_URL=postgres://postgres:your_password@localhost:5432/areal-hr_ext-test

  SECRET_KEY=your_secret_key

  ADMIN_LOGIN=admin
  ADMIN_PASSWORD=admin123

  PGADMIN_DEFAULT_EMAIL=admin@example.com
  PGADMIN_DEFAULT_PASSWORD=pgadmin123
  PGADMIN_PORT=5050
```

Замените your_password и your_secret_key на безопасные значения.


# Запуск через Docker
1. Убедитесь, что Docker и Docker Compose установлены.
2. Запустите приложение:

```bash
docker-compose up -d
```

3. Приложение доступно:
Приложение доступно:

- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- PgAdmin: http://localhost:5050

# Локальный запуск (без Docker)

1. Установите зависимости для backend:

```bash
cd server
npm install
```

2. Выполните миграции базы данных

```bash
npm run migrate:up
```

3. Запустите сервер:

```bash
npm run start
```

4. Установите зависимости для frontend: 

```bash
cd ../client
npm install
```

5. Запустите frontend: 

```bash
npm run dev
```

6. Приложение доступно:

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

# Полезные команды

## Создание миграций:
```bash
npm run migrate:create
```
## Откат миграций:
```bash
npm run migrate:down
```

## Заполнение тестовыми данными:
```bash
npm run seed
```

## Линтинг и форматирование
```bash
npm run lint
npm run format
```
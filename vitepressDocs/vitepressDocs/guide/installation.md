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
      POSTGRES_USER=hr_user
      POSTGRES_PASSWORD=secure_password
      POSTGRES_DB=hr_db
      VITE_APP_PORT=5173
      VITE_APP_PORT_SERVER=5001
      SECRET_KEY=secret_key
      ADMIN_LOGIN=admin
      ADMIN_PASSWORD=admin_pass
      PGADMIN_DEFAULT_EMAIL=admin@example.com
      PGADMIN_DEFAULT_PASSWORD=pgadmin_pass
      PGADMIN_PORT=5050
```


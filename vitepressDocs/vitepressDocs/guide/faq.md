# FAQ

## Не удается подключиться к базе данных

- Проверьте `.env`:
  - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Убедитесь, что PostgreSQL запущен:
  ```bash
  docker ps
  ```
- Перезапустите контейнер:
  ```bash
  docker-compose restart
  ```

## Ошибка авторизации

- Проверьте логин/пароль в `/auth/login`.
- Убедитесь, что пользователь не удален (`deleted_at IS NULL`).
- Проверьте `SECRET_KEY` в `.env`.

## Не загружается файл

- Проверьте права доступа к папке `/uploads`.
- Убедитесь, что размер файла не превышает лимит (настройка в NestJS).
- Проверьте формат файла (PDF, PNG, JPG).

## Docker не запускается

- Проверьте, что порты 5173, 5001, 5050 свободны:
  ```bash
  sudo netstat -tuln
  ```
- Перезапустите Docker:
  ```bash
  sudo systemctl restart docker
  ```

## Как сбросить базу данных?

- Выполните:
  ```bash
  npm run migrate:reset
  npm run migrate:up
  npm run seed
  ```

## Как добавить нового администратора?

- Авторизуйтесь как администратор.
- В разделе "Пользователи" создайте нового пользователя с ролью `admin`.

## Почему не работает Nginx?

- Проверьте конфигурацию:
  ```bash
  sudo nginx -t
  ```
- Перезапустите Nginx:
  ```bash
  sudo systemctl reload nginx
  ```

## Как обновить приложение?

- Вытяните изменения:
  ```bash
  git pull origin master
  ```
- Пересоберите контейнеры:
  ```bash
  docker-compose down
  docker-compose up -d --build
  ```
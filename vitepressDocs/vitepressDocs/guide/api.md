# API-документация

## Общая информация

API реализовано на REST с использованием Node.js. Аутентификация через Passport Local Strategy (без JWT). Все операции защищены, требуют авторизации. Администраторы имеют доступ к управлению пользователями, HR-менеджеры — к кадровым операциям.

- **Базовый URL**: [http://localhost:5001/api](http://localhost:5001/api)
- **Формат ответов**: JSON
- **Аутентификация**:
  - POST /auth/login для получения сессии.
  - Используйте login и password из .env (например, admin/admin123).
  - Для операций с /users требуется роль admin.

## Эндпоинты

### Аутентификация

| Метод | Эндпоинт    | Описание                         | Требуемая роль |
|-------|-------------|----------------------------------|----------------|
| POST  | /auth/login | Авторизация пользователя         | -              |
| POST  | /auth/logout| Выход из системы                 | -              |
| GET   | /auth/me    | Информация о текущем пользователе| -              |

**Пример запроса** (POST /auth/login):
```json
{
  "login": "admin",
  "password": "admin123"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "first_name": "Admin",
  "last_name": "User",
  "role": "admin"
}
```

**Схема (Joi)**:
```javascript
{
  login: Joi.string().required(),
  password: Joi.string().required()
}
```

### Организации

| Метод   | Эндпоинт   | Описание                      | Требуемая роль |
|---------|------------|-------------------------------|----------------|
| GET     | /orgs      | Получить список организаций   | hr_manager     |
| GET     | /orgs/:id  | Получить организацию по ID    | hr_manager     |
| POST    | /orgs      | Создать организацию           | hr_manager     |
| PUT     | /orgs/:id  | Обновить организацию          | hr_manager     |
| DELETE  | /orgs/:id  | Удалить организацию (мягкое)  | hr_manager     |

**Пример запроса** (POST /orgs):
```json
{
  "name": "ООО Ромашка",
  "comment": "Основная организация"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "name": "ООО Ромашка",
  "comment": "Основная организация",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  name: Joi.string().min(2).max(100).required(),
  comment: Joi.string().max(500).optional()
}
```

### Отделы

| Метод   | Эндпоинт   | Описание                  | Требуемая роль |
|---------|------------|---------------------------|----------------|
| GET     | /dept      | Получить список отделов   | hr_manager     |
| GET     | /dept/:id  | Получить отдел по ID      | hr_manager     |
| POST    | /dept      | Создать отдел             | hr_manager     |
| PUT     | /dept/:id  | Обновить отдел            | hr_manager     |
| DELETE  | /dept/:id  | Удалить отдел (мягкое)    | hr_manager     |

**Пример запроса** (POST /dept):
```json
{
  "name": "IT-отдел",
  "organization_id": 1,
  "parent_id": null,
  "comment": "Технический отдел"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "name": "IT-отдел",
  "organization_id": 1,
  "parent_id": null,
  "comment": "Технический отдел",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  name: Joi.string().min(2).max(100).required(),
  organization_id: Joi.number().integer().positive().allow(null).optional(),
  parent_id: Joi.number().integer().positive().allow(null).optional(),
  comment: Joi.string().allow('').optional()
}
```

### Должности

| Метод   | Эндпоинт   | Описание                    | Требуемая роль |
|---------|------------|----------------------------|----------------|
| GET     | /pos       | Получить список должностей  | hr_manager     |
| GET     | /pos/:id   | Получить должность по ID    | hr_manager     |
| POST    | /pos       | Создать должность           | hr_manager     |
| PUT     | /pos/:id   | Обновить должность          | hr_manager     |
| DELETE  | /pos/:id   | Удалить должность (мягкое)  | hr_manager     |

**Пример запроса** (POST /pos):
```json
{
  "name": "Разработчик"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "name": "Разработчик",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  name: Joi.string().min(2).max(255).required()
}
```

### Сотрудники

| Метод   | Эндпоинт   | Описание                     | Требуемая роль |
|---------|------------|-----------------------------|----------------|
| GET     | /emp       | Получить список сотрудников  | hr_manager     |
| GET     | /emp/:id   | Получить сотрудника по ID    | hr_manager     |
| POST    | /emp       | Создать сотрудника           | hr_manager     |
| PUT     | /emp/:id   | Обновить сотрудника          | hr_manager     |
| DELETE  | /emp/:id   | Удалить сотрудника (мягкое)  | hr_manager     |

**Пример запроса** (POST /emp):
```json
{
  "first_name": "Иван",
  "last_name": "Иванов",
  "middle_name": "Иванович",
  "birth_date": "1990-01-01",
  "passport_series": "1234",
  "passport_number": "567890",
  "passport_issue_date": "2010-01-01",
  "passport_issued_by": "УФМС России",
  "region": "Москва",
  "locality": "Москва",
  "street": "Ленина",
  "house": "10"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "first_name": "Иван",
  "last_name": "Иванов",
  "middle_name": "Иванович",
  "birth_date": "1990-01-01",
  "passport_series": "1234",
  "passport_number": "567890",
  "passport_issue_date": "2010-01-01",
  "passport_issued_by": "УФМС России",
  "region": "Москва",
  "locality": "Москва",
  "street": "Ленина",
  "house": "10",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  middle_name: Joi.string().min(2).max(100).allow('').optional(),
  birth_date: Joi.date().iso().required(),
  passport_series: Joi.string().pattern(/^\d{4}$/).required(),
  passport_number: Joi.string().pattern(/^\d{6}$/).required(),
  passport_issue_date: Joi.date().iso().required(),
  passport_issued_by: Joi.string().min(5).max(200).required(),
  region: Joi.string().min(2).max(100).required(),
  locality: Joi.string().min(2).max(100).required(),
  street: Joi.string().min(2).max(100).required(),
  house: Joi.string().max(10).required(),
  building: Joi.string().max(10).allow('').optional(),
  apartment: Joi.string().max(10).allow('').optional()
}
```

### Файлы

| Метод   | Эндпоинт             | Описание                | Требуемая роль |
|---------|----------------------|-------------------------|----------------|
| GET     | /file                | Получить список файлов  | hr_manager     |
| GET     | /file/:id            | Получить файл по ID     | hr_manager     |
| GET     | /file/:id/download   | Скачать файл            | hr_manager     |
| POST    | /file                | Загрузить файл          | hr_manager     |
| PUT     | /file/:id            | Обновить файл           | hr_manager     |
| DELETE  | /file/:id            | Удалить файл (мягкое)   | hr_manager     |

**Пример запроса** (POST /file):
```
Content-Type: multipart/form-data
file: <файл.pdf>
employee_id: 1
file_name: passport_scan.pdf
comment: Скан паспорта
```

**Пример ответа**:
```json
{
  "id": 1,
  "employee_id": 1,
  "file_name": "passport_scan.pdf",
  "file_path": "/uploads/passport_scan.pdf",
  "comment": "Скан паспорта",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  employee_id: Joi.number().integer().positive().required(),
  file_name: Joi.string().min(1).max(255).optional(),
  file_path: Joi.string().min(1).max(500).required(),
  comment: Joi.string().max(500).optional()
}
```

### Кадровые операции

| Метод   | Эндпоинт   | Описание                     | Требуемая роль |
|---------|------------|-----------------------------|----------------|
| GET     | /hrOp      | Получить список операций     | hr_manager     |
| GET     | /hrOp/:id  | Получить операцию по ID      | hr_manager     |
| POST    | /hrOp      | Создать операцию             | hr_manager     |
| PUT     | /hrOp/:id  | Обновить операцию            | hr_manager     |
| DELETE  | /hrOp/:id  | Удалить операцию (мягкое)    | hr_manager     |

**Пример запроса** (POST /hrOp):
```json
{
  "employee_id": 1,
  "department_id": 1,
  "position_id": 1,
  "action_type": "hire",
  "salary": 50000.00,
  "operation_date": "2025-05-17"
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "employee_id": 1,
  "department_id": 1,
  "position_id": 1,
  "action_type": "hire",
  "salary": 50000.00,
  "operation_date": "2025-05-17",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  employee_id: Joi.number().integer().positive().required(),
  department_id: Joi.number().integer().positive().when('action_type', {
    is: Joi.valid('hire', 'change_department'),
    then: Joi.required()
  }),
  position_id: Joi.number().integer().positive().when('action_type', {
    is: Joi.valid('hire', 'change_department'),
    then: Joi.required()
  }),
  action_type: Joi.string().valid('hire', 'department_change', 'salary_change', 'dismissal').required(),
  salary: Joi.number().precision(2).positive().when('action_type', {
    is: Joi.valid('hire', 'salary_change'),
    then: Joi.required()
  }),
  operation_date: Joi.date().iso().required()
}
```

### История изменений

| Метод   | Эндпоинт             | Описание                       | Требуемая роль |
|---------|----------------------|--------------------------------|----------------|
| GET     | /changeHistory       | Получить историю изменений     | hr_manager     |
| GET     | /changeHistory/:id   | Получить запись по ID          | hr_manager     |
| POST    | /changeHistory       | Создать запись                 | hr_manager     |
| PUT     | /changeHistory/:id   | Обновить запись                | hr_manager     |
| DELETE  | /changeHistory/:id   | Удалить запись (мягкое)        | hr_manager     |

**Пример запроса** (POST /changeHistory):
```json
{
  "object_type": "employee",
  "object_id": 1,
  "changed_fields": {
    "first_name": "Иван",
    "last_name": "Иванов"
  }
}
```

**Пример ответа**:
```json
{
  "id": 1,
  "change_time": "2025-05-17T15:27:00Z",
  "change_by": 1,
  "object_type": "employee",
  "object_id": 1,
  "changed_fields": {
    "first_name": "Иван",
    "last_name": "Иванов"
  },
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  change_time: Joi.date().default(() => new Date()),
  change_by: Joi.number().integer().positive().default(1),
  object_type: Joi.string().valid('organization', 'department', 'position', 'employee', 'hr_operations').required(),
  object_id: Joi.number().integer().positive().required(),
  changed_fields: Joi.object().required()
}
```

### Пользователи

| Метод   | Эндпоинт             | Описание                     | Требуемая роль |
|---------|----------------------|------------------------------|----------------|
| GET     | /users/for-history   | Пользователи для истории     | hr_manager     |
| GET     | /users               | Получить список пользователей| admin          |
| GET     | /users/:id           | Получить пользователя по ID  | admin          |
| POST    | /users               | Создать пользователя         | admin          |
| PUT     | /users/:id           | Обновить пользователя        | admin          |
| DELETE  | /users/:id           | Удалить пользователя (мягкое)| admin          |

**Пример запроса** (POST /users):
```json
{
  "last_name": "Петров",
  "first_name": "Петр",
  "middle_name": "Петрович",
  "login": "petrov",
  "password": "petrov123",
  "role": "hr_manager"
}
```

**Пример ответа**:
```json
{
  "id": 2,
  "last_name": "Петров",
  "first_name": "Петр",
  "middle_name": "Петрович",
  "login": "petrov",
  "role": "hr_manager",
  "created_at": "2025-05-17T15:27:00Z"
}
```

**Схема (Joi)**:
```javascript
{
  last_name: Joi.string().min(2).max(100).required(),
  first_name: Joi.string().min(2).max(100).required(),
  middle_name: Joi.string().min(2).max(100).allow('').optional(),
  login: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('admin', 'hr_manager').required()
}
```

## Аутентификация (Passport Local Strategy)

- Используется passport.
- Пароли шифруются с помощью Argon2id.
- Сессии хранятся в памяти (не в базе).
- Middleware:
  - ensureAuthenticated: Проверяет, авторизован ли пользователь.
  - requireRole: Ограничивает доступ по роли (admin или hr_manager).


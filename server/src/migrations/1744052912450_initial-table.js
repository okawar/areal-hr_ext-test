exports.shorthands = undefined;

exports.up = (pgm) => {
  // Таблица users
  pgm.createTable('users', {
    id: 'id',
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    middle_name: { type: 'varchar(100)' },
    login: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица organizations
  pgm.createTable('organizations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица positions
  pgm.createTable('positions', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица departments
  pgm.createTable('departments', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    parent_id: { type: 'integer', references: 'departments(id)', onDelete: 'SET NULL' },
    comment: { type: 'text' },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица employees
  pgm.createTable('employees', {
    id: 'id',
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    middle_name: { type: 'varchar(100)' },
    birth_date: { type: 'date', notNull: true },

    passport_series: { type: 'char(4)', notNull: true },
    passport_number: { type: 'char(6)', notNull: true },
    passport_issue_date: { type: 'date', notNull: true },
    passport_issued_by: { type: 'text', notNull: true },

    region: { type: 'varchar(100)', notNull: true },
    locality: { type: 'varchar(100)', notNull: true },
    street: { type: 'varchar(100)', notNull: true },
    house: { type: 'varchar(10)', notNull: true },
    building: { type: 'varchar(10)' },
    apartment: { type: 'varchar(10)' },

    department_id: { type: 'integer', notNull: true, references: 'departments(id)', onDelete: 'RESTRICT' },
    position_id: { type: 'integer', notNull: true, references: 'positions(id)', onDelete: 'RESTRICT' },

    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица files
  pgm.createTable('files', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'text', notNull: true },
    employee_id: { type: 'integer', references: 'employees(id)', onDelete: 'CASCADE' },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
    deleted_at: { type: 'timestamp' }
  });

  // Таблица supervisions (кадровые операции)
  pgm.createTable('supervisions', {
    id: 'id',
    employee_id: { type: 'integer', notNull: true, references: 'employees(id)', onDelete: 'CASCADE' },
    operator_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'SET NULL' },
    department_id: { type: 'integer', references: 'departments(id)', onDelete: 'SET NULL' },
    position_id: { type: 'integer', references: 'positions(id)', onDelete: 'SET NULL' },
    action: { type: 'varchar(50)', notNull: true }, // например: hire, transfer, salary_change, fire
    salary: { type: 'numeric(10,2)' },
    operation_date: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // Таблица change_history
  pgm.createTable('change_history', {
    id: 'id',
    change_time: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    object_type: { type: 'varchar(100)', notNull: true },
    object_id: { type: 'integer', notNull: true },
    changed_fields: { type: 'jsonb', notNull: true },
    user_id: { type: 'integer', references: 'users(id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('change_history');
  pgm.dropTable('supervisions');
  pgm.dropTable('files');
  pgm.dropTable('employees');
  pgm.dropTable('departments');
  pgm.dropTable('positions');
  pgm.dropTable('organizations');
  pgm.dropTable('users');
};

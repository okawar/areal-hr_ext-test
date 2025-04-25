const argon2 = require('argon2');
require('dotenv').config({ path: '../../../.env' });

exports.shorthands = {
  timestamps: {
    created_at: { type: 'timestamp', notNull: true, default: 'now()' },
    updated_at: { type: 'timestamp', notNull: true, default: 'now()' },
    deleted_at: { type: 'timestamp' },
  },
};

exports.up = async (pgm) => {
  pgm.createTable('organizations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('positions', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('departments', {
    id: 'id',
    organization_id: {
      type: 'integer',
      references: 'organizations',
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)', notNull: true },
    parent_id: {
      type: 'integer',
      references: 'departments',
      onDelete: 'SET NULL',
    },
    comment: { type: 'text' },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('employees', {
    id: 'id',
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)' },
    birth_date: { type: 'date' },
    passport_series: { type: 'varchar(20)' },
    passport_number: { type: 'varchar(20)' },
    passport_issue_date: { type: 'date' },
    passport_issued_by: { type: 'varchar(255)' },
    region: { type: 'varchar(255)' },
    locality: { type: 'varchar(255)' },
    street: { type: 'varchar(255)' },
    house: { type: 'varchar(20)' },
    building: { type: 'varchar(20)' },
    apartment: { type: 'varchar(20)' },
    department_id: {
      type: 'integer',
      references: 'departments',
      onDelete: 'SET NULL',
    },
    position_id: {
      type: 'integer',
      references: 'positions',
      onDelete: 'SET NULL',
    },
    salary: { type: 'numeric(10,2)' },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('files', {
    id: 'id',
    file_name: { type: 'varchar(255)', notNull: true },
    file_path: { type: 'text', notNull: true },
    employee_id: {
      type: 'integer',
      references: 'employees',
      onDelete: 'CASCADE',
    },
    comment: { type: 'text' },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('users', {
    id: 'id',
    last_name: { type: 'varchar(255)', notNull: true },
    first_name: { type: 'varchar(255)', notNull: true },
    middle_name: { type: 'varchar(255)' },
    login: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    role: { type: 'varchar(50)', notNull: true },
    ...exports.shorthands.timestamps,
  });

  pgm.createTable('hr_operations', {
    id: 'id',
    employee_id: {
      type: 'integer',
      references: 'employees',
      onDelete: 'CASCADE',
    },
    department_id: {
      type: 'integer',
      references: 'departments',
      onDelete: 'SET NULL',
    },
    position_id: {
      type: 'integer',
      references: 'positions',
      onDelete: 'SET NULL',
    },
    action_type: {
      type: 'varchar(50)',
      notNull: true,
      check: `action_type IN ('hire', 'salary_change', 'department_change', 'dismissal')`,
    },
    salary: { type: 'integer' },
    operation_date: { type: 'date', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: 'now()' },
  });

  pgm.createTable('change_history', {
    id: 'id',
    change_time: { type: 'timestamp', notNull: true, default: 'now()' },
    change_by: {
      type: 'integer',
      references: 'users',
      onDelete: 'SET NULL',
    },
    object_type: {
      type: 'varchar(50)',
      notNull: true,
      check: `object_type IN ('organization', 'department', 'position', 'employee', 'hr_operations')`,
    },
    object_id: { type: 'integer', notNull: true },
    changed_fields: { type: 'jsonb', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: 'now()' },
  });

  const adminLogin = process.env.ADMIN_LOGIN || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
  const hashedPassword = await argon2.hash(adminPassword);

  const res = await pgm.db.query('SELECT * FROM users WHERE login = $1', [adminLogin]);

  if (res.rows.length === 0) {
    await pgm.db.query(
      'INSERT INTO users (login, password_hash, role, created_at) VALUES ($1, $2, $3, NOW())',
      [adminLogin, hashedPassword, 'admin']
    );
    console.log('Администратор создан!');
  } else {
    console.log('Администратор уже существует');
  }
};

exports.down = (pgm) => {
  pgm.dropTable('change_history');
  pgm.dropTable('hr_operations');
  pgm.dropTable('users');
  pgm.dropTable('files');
  pgm.dropTable('employees');
  pgm.dropTable('departments');
  pgm.dropTable('positions');
  pgm.dropTable('organizations');
};

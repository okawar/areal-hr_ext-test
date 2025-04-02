/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // Таблица organizations
  pgm.createTable('organizations', {
    id: 'id', // Первичный ключ (автоинкрементный)
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
    is_deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamp' },
  });

  // Таблица departments
  pgm.createTable('departments', {
    id: 'id',
    organization_id: { type: 'integer', notNull: true, references: 'organizations(id)', onDelete: 'CASCADE' },
    name: { type: 'varchar(255)', notNull: true },
    parent_id: { type: 'integer', references: 'departments(id)', onDelete: 'SET NULL' },
    comment: { type: 'text' },
    is_deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamp' },
  });

  // Таблица positions
  pgm.createTable('positions', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    is_deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamp' },
  });

  // Добавляем индексы для ускорения запросов
  pgm.createIndex('departments', 'organization_id');
  pgm.createIndex('departments', 'parent_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('positions');
  pgm.dropTable('departments');
  pgm.dropTable('organizations');
};

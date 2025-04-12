// utils/historyLogger.js

const pool = require("../database/database");

/**
 * Сравнивает старые и новые данные, записывает изменения в таблицу change_history
 * @param {string} objectType - Тип объекта (например, 'department')
 * @param {number|string} objectId - ID объекта
 * @param {object|null} oldData - Старые данные (из базы) или null
 * @param {object|null} newData - Новые данные (из запроса) или null
 * @param {string} action - Тип действия: 'update', 'delete', 'create'
 * @param {number} userId - ID пользователя
 */



async function logChanges(objectType, objectId, oldData, newData, action, userId) {
    const changedFields = {};
  
    if (action === 'update') {
      for (const key in newData) {
        const oldValue = oldData?.[key] ?? null;
        const newValue = newData?.[key] ?? null;
  
        const cleanedOldValue = typeof oldValue === 'string' ? oldValue.trim() : oldValue;
        const cleanedNewValue = typeof newValue === 'string' ? newValue.trim() : newValue;
  
        if (cleanedOldValue !== cleanedNewValue) {
          changedFields[key] = { old: oldValue, new: newValue };
        }
      }
  
      if (Object.keys(changedFields).length > 0) {
        changedFields.action = 'update';
      }
    } 
    else if (action === 'delete') {
      changedFields.action = 'delete';
      changedFields.deleted = { old: false, new: true };
    } 
    else if (action === 'create') {
      changedFields.action = 'create';
      for (const key in newData) {
        if (newData[key] !== undefined) {
          changedFields[key] = { old: null, new: newData[key] };
        }
      }
    }
  
  
    if (Object.keys(changedFields).length > 0) {
      await pool.query(
        `INSERT INTO change_history (object_type, object_id, changed_fields, change_by, change_time)
         VALUES ($1, $2, $3, $4, NOW())`,
        [objectType, objectId, JSON.stringify(changedFields), userId]
      );
    }
  }
  

  
  

module.exports = { logChanges };

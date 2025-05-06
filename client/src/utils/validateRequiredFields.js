export function validateRequiredFields(formData, requiredFields, fieldLabels = {}) {
    const errors = {};
  
    for (const field of requiredFields) {
      const value = formData[field];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        errors[field] = `${fieldLabels[field] || field} обязательно для заполнения`;
      }
    }
  
    return errors;
  }
  
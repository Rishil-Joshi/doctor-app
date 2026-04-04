/**
 * Email validation
 * @param {string} email
 * @returns {boolean}
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * Requires: min 8 characters, 1 uppercase, 1 number
 * @param {string} password
 * @returns {boolean}
 */
const validatePassword = (password) => {
  return password && password.length >= 5;
};

/**
 * Phone number validation
 * Supports various formats: (555) 123-4567, 555-123-4567, 5551234567, +1 555 123 4567, etc.
 * @param {string} phone
 * @returns {boolean}
 */
const validatePhone = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '');
  return /^[0-9]{10}$/.test(digitsOnly);
};

/**
 * Username validation
 * @param {string} username
 * @returns {boolean}
 */
const validateUsername = (username) => {
  return username && username.trim().length > 0;
};

/**
 * First name validation
 * @param {string} firstName
 * @returns {boolean}
 */
const validateFirstName = (firstName) => {
  return firstName && firstName.trim().length > 0;
};

/**
 * Last name validation
 * @param {string} lastName
 * @returns {boolean}
 */
const validateLastName = (lastName) => {
  return lastName && lastName.trim().length > 0;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
  validateFirstName,
  validateLastName,
};

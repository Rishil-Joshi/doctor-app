const { User } = require('../models/User');
const { generateToken } = require('../utils/jwt');
const {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateUsername,
} = require('../utils/validators');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

/**
 * Register a new user
 * @param {object} userData
 * @returns {object} { user, token }
 */
const registerUser = async (userData) => {
  const { username, email, password, confirmPassword, firstName, lastName, phone, specialization, clinicName } = userData;

  // Validate required fields
  if (!validateUsername(username) || !validateEmail(email) || !validatePassword(password) || 
      !validateFirstName(firstName) || !validateLastName(lastName) || !validatePhone(phone)) {
    throw new AppError(ERROR_MESSAGES.MISSING_REQUIREMENT, 400);
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw new AppError(ERROR_MESSAGES.INVALID_EMAIL, 400);
  }

  // Validate password strength
  if (!validatePassword(password)) {
    throw new AppError(ERROR_MESSAGES.WEAK_PASSWORD, 400);
  }

  // Validate passwords match
  if (password !== confirmPassword) {
    throw new AppError(ERROR_MESSAGES.PASSWORDS_MISMATCH, 400);
  }

  // Validate phone format
  if (!validatePhone(phone)) {
    throw new AppError(ERROR_MESSAGES.INVALID_PHONE, 400);
  }

  // Check if username exists
  const existingUser = await User.findByUsername(username);
  if (existingUser) {
    throw new AppError(ERROR_MESSAGES.USERNAME_EXISTS, 400);
  }

  // Check if email exists
  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 400);
  }

  // Create user
  const user = await User.create(username, email, password, firstName, lastName, phone, specialization, clinicName);
  const token = generateToken(user.id);

  return { user, token };
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {object} { user, token }
 */
const loginUser = async (username, password) => {
  if (!username || !password) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const user = await User.findByUsername(username);
  if (!user) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const isValidPassword = await User.verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const token = generateToken(user.id);
  const userData = await User.findById(user.id);

  return { user: userData, token };
};

/**
 * Get user profile
 * @param {number} userId
 * @returns {object} user
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

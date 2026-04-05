const { User } = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validatePassword, validateUsername } = require('../utils/validators');
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

/**
 * Register a new user
 * @param {object} userData - Only username, password, and role are required
 * @returns {object} { user, token }
 */
const registerUser = async (userData) => {
  const { username, password, role } = userData;

  if (!validateUsername(username)) throw new AppError(ERROR_MESSAGES.USERNAME_REQUIRED, 400);
  if (!validatePassword(password)) throw new AppError(ERROR_MESSAGES.PASSWORD_REQUIRED, 400);
  if (password.length < 5) throw new AppError(ERROR_MESSAGES.WEAK_PASSWORD, 400);

  const existingUser = await User.findByUsername(username);
  if (existingUser) throw new AppError(ERROR_MESSAGES.USERNAME_EXISTS, 400);

  const user = await User.create(username, null, password, null, null, null, null, null, role || null);
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

const { registerUser, loginUser, getUserProfile } = require('../services/authService');
const { formatError } = require('../utils/errors');

/**
 * Register endpoint
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Login endpoint
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

/**
 * Get current user profile
 * GET /auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.userId);
    res.json({ user });
  } catch (err) {
    const { error, statusCode } = formatError(err);
    res.status(statusCode).json({ error });
  }
};

module.exports = { register, login, getProfile };
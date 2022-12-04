/** @format */

const { verify } = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res
        .status(400)
        .json({ message: 'you are not authorized to access this route' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(404).json({ message: 'there is no token provided ' });
    }

    verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ message: `error with token ${error.message}` });
      }

      const { id } = decoded;

      const user = await User.findOne({ id }, { password: 0 });
      if (!user) {
        return res.status(404).json({ message: 'user not found!' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).send({ message: 'Not auth' });
  try {
    let decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decoded.id }, { password: 0 });
    if (user) {
      if (user.role == 'admin') {
        req.user = user;
        return next();
      } else {
        return res
          .status(403)
          .send({ message: 'you are not authorized to do this action!' });
      }
    }
    return res.status(401).send({ message: 'sorry user is not found' });
  } catch (err) {
    res.status(403).send({ message: err.message });
  }
};

module.exports = {
  auth,
  isAdmin,
};

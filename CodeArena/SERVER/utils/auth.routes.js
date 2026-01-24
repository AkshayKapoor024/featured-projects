const express = require('express');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const ValidateUser = require('../utils/userValidate');
const customError = require('../utils/customError');
const authController = require('../controllers/auth.controller');

const router = express.Router();

const userValidation = (req, res, next) => {
  const { error } = ValidateUser.validate(req.body);
  if (error) {
    throw new customError(400, error.details[0].message);
  }
  next();
};

router.get('/session-check', authController.sessionCheck);

router.post('/signup',
  userValidation,
  wrapAsync(authController.signup)
);

router.post('/login',
  passport.authenticate('local'),
  authController.login
);

router.get('/logout', authController.logout);
router.get('/isAuthenticated', authController.isAuthenticated);

module.exports = router;

const express = require('express');
const { deleteUser, updateUser } = require('../controllers/users.controller');
const { authenticateUser } = require('../middlewares/authentication.middleware');
const { validateUpdateUser } = require('../middlewares/validators/user.validator');


const usersRouter = express.Router();

usersRouter.patch("/", [ authenticateUser, validateUpdateUser], updateUser);

usersRouter.delete("/", authenticateUser, deleteUser)

module.exports = usersRouter;
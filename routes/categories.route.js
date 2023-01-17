const express = require('express');
const { getAllCategories, updateCategory, deleteCategory, createCategory } = require('../controllers/categories.controller');
const { authenticateUser } = require('../middlewares/authentication.middleware');
const { authorizeAdmin } = require('../middlewares/authorization.middleware');
const { validateCreateCategory, validateUpdateCategory } = require('../middlewares/validators/category.validator');

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', getAllCategories)

// Create new category
categoriesRouter.post('/',[authenticateUser, authorizeAdmin, validateCreateCategory], createCategory)

// Update a category
categoriesRouter.patch('/:id', [authenticateUser, authorizeAdmin, validateUpdateCategory], updateCategory)

// Delete a category
categoriesRouter.delete('/:id', [authenticateUser, authorizeAdmin], deleteCategory)

module.exports = { categoriesRouter };
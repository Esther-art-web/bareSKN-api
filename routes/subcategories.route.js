const express = require("express");
const { createSubcategory, getAllSubcategories, getSubcategoryByCategoryKey, getProductsBySubcategory, updateSubcategory, deleteSubcategory } = require("../controllers/subcategories.controller");
const { authenticateUser } = require("../middlewares/authentication.middleware");
const { authorizeAdmin } = require("../middlewares/authorization.middleware");
const { validateCreateSubcategory, validateUpdateSubcategory } = require("../middlewares/validators/subcategory.validator");

const subCategoriesRouter = express.Router();

// Get all the subcategories
subCategoriesRouter.get('/', getAllSubcategories)

// Get all subcategories by category key
subCategoriesRouter.get('/:category_key', getSubcategoryByCategoryKey)

// Get products by subcategory
subCategoriesRouter.get('/:subcat_key/products', getProductsBySubcategory);

// Create new subcategory
subCategoriesRouter.post('/', [authenticateUser, authorizeAdmin, validateCreateSubcategory],  createSubcategory)

// Update a subcategory
subCategoriesRouter.patch('/:id', [authenticateUser, authorizeAdmin, validateUpdateSubcategory], updateSubcategory)

// Delete a subcategory
subCategoriesRouter.delete('/:id', [authenticateUser, authorizeAdmin], deleteSubcategory)

module.exports = {subCategoriesRouter};
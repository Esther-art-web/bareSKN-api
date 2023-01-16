const express = require('express');
const Product = require("../models/product.model");
const Collection = require("../models/collection.model");
const { getAllCollections, createCollection, getCollectionByKey, getProductsByCollection, updateCollection, deleteCollection } = require('../controllers/collections.controller');
const { authenticateUser } = require('../middlewares/authentication.middleware');
const { authorizeAdmin } = require('../middlewares/authorization.middleware');
const { validateCreateCollection, validateUpdateCollection } = require('../middlewares/validators/collection.validator');

const collectionsRouter = express.Router();

// Get all the collections 
collectionsRouter.get('/', getAllCollections)

// Get collection by key
collectionsRouter.get('/:key', getCollectionByKey);

// Get products by collection
collectionsRouter.get('/:coll_key/products', getProductsByCollection)

// Create new collection
collectionsRouter.post('/',[authenticateUser, authorizeAdmin, validateCreateCollection], createCollection)

// Update a collection
collectionsRouter.patch('/:id',[authenticateUser, authorizeAdmin, validateUpdateCollection], updateCollection)

// Delete a collection
collectionsRouter.delete('/:id', [authenticateUser, authorizeAdmin], deleteCollection)


module.exports = {collectionsRouter};
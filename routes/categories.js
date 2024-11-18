const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get a category
router.get('/:id', getCategory);

// Create category
router.post('/', authenticate, adminOnly, createCategory);

// Update category
router.patch('/:id', authenticate, adminOnly, updateCategory);

// Delete category
router.delete('/:id', authenticate, adminOnly, deleteCategory);

module.exports = router;
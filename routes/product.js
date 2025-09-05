import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        let query = {};

        // Only apply businessId if it exists
        if (req.businessId) {
            query.businessId = req.businessId;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});


// Get single Product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
        })
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.json({
            success: true,
            product
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        })
    }
})

// Create new product

router.post('/products', async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || price === undefined || stock === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        if (price < 0 || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price and stock cannot be negative'
            })
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            businessId: "64fae9c2f3a23b78d9e8c9a1"
        })
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product Created successfully',
            product,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        })
    }
})

// Update product 

router.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // Validation
        if (price !== undefined && price < 0) {
            return res.status(400).json({ success: false, message: 'Price cannot be negative' });
        }
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
        }

        // Only update provided fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (price !== undefined) updateFields.price = price;
        if (stock !== undefined) updateFields.stock = stock;
        if (category !== undefined) updateFields.category = category;

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, }, // secure scope
            updateFields,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

export default router;
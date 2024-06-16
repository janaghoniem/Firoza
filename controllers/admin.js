const User = require('../models/User');
const collections = require('../models/Collections');
const bcrypt = require('bcrypt');
const Product = require('../models/product');
const Order = require('../models/Orders');

const { v4: uuidv4 } = require('uuid');

// Function to add an admin
const addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            isAdmin: true,
            address: [], // Optional field, can be updated if needed
            wishlist: [],
            orders: [],
            cart: [],
            Token: '',
            Tokenexpiry: null,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Function to add an admin
const addCollection = async (req, res) => {

    const {
        CollectionName,
        CollectionDescription,
        img
    } = req.body;

    try {
        // Validate input
        if (!CollectionName || !CollectionDescription) {
            return res.status(400).json({ message: 'Collection name, description, required' });
        }

        // Create a new Product object based on the schema
        const newCollection = new collections({
            Collection_Name: CollectionName,
            Collection_Description: CollectionDescription,
            collection_id: uuidv4(),

            img
        });

        // Save the product to the database
        await newCollection.save();

        res.status(201).json({ message: 'Collection added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const getCollections = async (req, res) => {
    try {
        const getC = await collections.find({});
        res.render('EditLayout', { getC });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to delete a collection
const deleteCollection = async (req, res) => {
    console.log("da5al gowa el function");
    try {
        const { id  } = req.params;
        const deletedCollection = await collections.findByIdAndDelete({id} );

        if (!deletedCollection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        console.log(`Attempting to delete collection with ID: ${id}`);
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error collection:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



//edit collection on the server side
const editCollection = async (req, res) => {
    const collectionId = req.params.collection_id;
    const { collectionName, description } = req.body;

    try {
        // Update the collection document by its collection_id
        const updatedCollection = await collections.findByIdAndUpdate(
            { collection_id: collectionId },
            {
                Collection_Name: collectionName,
                Collection_Description: description
            },
            { new: true }
        );

        if (!updatedCollection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.status(200).json({ success: true, data: updatedCollection });
    } catch (error) {
        console.error('Error updating collection:', error);
        res.status(500).json({ error: error.message });
    }
};


//Function to add a product
const addProduct = async (req, res) => {
    const {
        product_id,
        collection_id,
        name,
        description,
        category,
        price,
        img,
        material,
        color,
        rating,
        no_sales,
        sizes,
        quantities
    } = req.body;

    try {
        // Validate input
        if (!product_id || !collection_id || !name || !description || !category || !price || !img || !material || !color || !sizes || !quantities) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure sizes and quantities arrays are the same length
        if (sizes.length !== quantities.length) {
            return res.status(400).json({ message: 'Add a size or quantity' });
        }

        // Create size-quantity pairs
        const sizeQuantityPairs = sizes.map((size, index) => ({
            size,
            quantity: quantities[index]
        }));

        // Create a new Product object based on the schema
        const newProduct = new Product({
            product_id,
            collection_id,
            name,
            description,
            category,
            price,
            img,
            sizes: sizeQuantityPairs, 
            rating: rating || 0,
            material,
            color,
            no_sales: no_sales || 0
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', data: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



const GetAllUsers = (req, res) => {
    User.find()
        .then(result => {

            res.render('Users', { users: result }); // Note the lowercase 'users'
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving users');
        });
};
//function to get orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'name') // Populate user name
            .populate('product_ids', 'name price'); // Populate product name and price

        res.render('admin-orders', { orders }); // Pass the orders data to the view
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server Error');
    }
};

// const editProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const { name, price, collection_id, category, description, sizes, quantities, material, color } = req.body;
//         const img = req.file ? req.file.path : undefined; 

//         if (sizes.length !== quantities.length) {
//             return res.status(400).json({ message: 'Sizes and quantities must match' });
//         }

//         const sizeQuantityPairs = sizes.map((size, index) => ({
//             size,
//             quantity: quantities[index]
//         }));

//         const updatedData = {
//             name,
//             price,
//             collection_id,
//             category,
//             description,
//             sizes: sizeQuantityPairs,
//             material,
//             color
//         };

//         if (img) {
//             updatedData.img = img;
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(500).json({ error: 'Server error' });

//     }
// };

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('Admin-products', { products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Server error');
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const users = await User.find({ 'cart.productId': id });

        for (const user of users) {
            user.cart = user.cart.filter(item => item.productId.toString() !== id.toString());
            await user.save();
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// const editProduct = async (req, res) => {
//     try {
//         const { product_id, name, price, collection_id, category, description, sizes, quantities, material, color } = req.body;

//         if (!product_id || !name || !price || !collection_id || !category || !description || !sizes || !quantities || !material || !color) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         if (sizes.length !== quantities.length) {
//             return res.status(400).json({ message: 'Sizes and quantities must match' });
//         }

//         const sizeQuantityPairs = sizes.map((size, index) => ({
//             size,
//             quantity: quantities[index]
//         }));

//         const updatedProduct = await Product.findByIdAndUpdate(product_id, {
//             name,
//             price,
//             collection_id,
//             category,
//             description,
//             sizes: sizeQuantityPairs,
//             material,
//             color
//         }, { new: true });

//         if (!updatedProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
const getEditProductPage = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("Get Edit Product Page - Product ID:", productId);

        const product = await Product.findById(productId);
        console.log("Get Edit Product Page - Fetched Product:", product);

        if (!product) {
            console.error("Get Edit Product Page - Product not found");
            return res.status(404).send('Product not found');
        }

        res.render('EditProduct', {product});
        console.log("Get Edit Product Page - Rendered EditProduct page with product");
    } catch (error) {
        console.error("Get Edit Product Page - Error:", error);
        res.status(500).send('Server error');
    }
};

// Function to handle product edits
const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;
        console.log("Edit Product - Product ID:", productId);
        console.log("Edit Product - Updated Data:", updatedData);

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        console.log("Edit Product - Updated Product:", updatedProduct);

        if (!updatedProduct) {
            console.error("Edit Product - Product not found");
            return res.status(404).send('Product not found');
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error("Edit Product - Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addAdmin,
    addCollection,
    addProduct,
    editCollection,
    getCollections,
    deleteCollection,
    GetAllUsers,
    getOrders,
    getProducts,
    deleteProduct,
    getEditProductPage,
    editProduct
};

//function to get orders

// exports.getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find()
//             .populate({
//                 path: 'user_id',
//                 model: 'User'
//             })
//             .populate({
//                 path: 'product_ids',
//                 model: 'Product'
//             });

//         res.render('admin-orders', { orders });
//     } catch (err) {
//         console.error('Error fetching orders:', err);
//         res.status(500).send('Server Error');
//     }
// };


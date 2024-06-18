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
      
        console.log("akfufrujgr");
        const { id  } = req.params;
        const deletedCollection = await collections.findByIdAndDelete(id);
        console.log("1111111");
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
    const collectionId = req.params.id;
    const { collectionName, description } = req.body;

    try {
        // Update the collection document by its collection_id
        const updatedCollection = await collections.findByIdAndUpdate(
            collectionId,
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
        if (!collection_id || !name || !description || !category || !price || !img || !material || !color || !sizes || !quantities) {
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

// const getOrders = (req, res) => {
//     Order.find()
//         .then(result => {

//             res.render('admin-orders', { orders: result }); // Note the lowercase 'users'
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).send('Error retrieving users');
//         });
// };

// const getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find()
//             .populate('user_id', 'name') // Populate user name
//             .populate('product_ids', 'name price'); // Populate product name and price

//         res.render('admin-orders', { orders }); // Pass the orders data to the view
//     } catch (err) {
//         console.error('Error fetching orders:', err);
//         res.status(500).send('Server Error');
//     }
// };

const getOrders = (req, res) => {
    Order.find()
        .populate('user_id', 'firstname lastname') // Populate the user_id field with the firstname and lastname fields from the User model
        .populate({
            path: 'product_ids',
            select: 'name', 
            model: 'Product' 
        })
        .then(result => {
            res.render('admin-orders', { orders: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving orders');
        });
  };
  

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

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('EditProduct', { product });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Function to handle product edits
const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;

        // Ensure the sizes are processed correctly if they come as arrays
        if (Array.isArray(updatedData.sizes)) {
            updatedData.sizes = updatedData.sizes.map((size, index) => ({
                size,
                quantity: updatedData.quantities[index]
            }));
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//-------------------------------------------------------habiba-------------------------------------------

const getDashboard = async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        // 1. Count documents (orders) created in the last 30 days
        const orderCount = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // 2. Calculate revenue from orders in the last 30 days
        const ordersLast30Days = await Order.find({
            createdAt: { $gte: thirtyDaysAgo }
        })
        .populate({
            path: 'product_ids',
            select: 'name', 
            model: 'Product' 
        })
        let revenueLast30Days = 0;
        ordersLast30Days.forEach(order => {
            revenueLast30Days += order.total_price;
        });

        // 3. Find products that are out of stock
        const productsOutOfStock = await Product.find({
            sizes: { $elemMatch: { quantity: 0 } }
        });

        // Render the EJS template with the collected data
        res.render('main', {
            ordersLast30Days: orderCount,
            revenueLast30Days,
            productsOutOfStock
        });
    } catch (error) {
        console.error('Error fetching order count:', error);
        res.status(500).render('error', { error }); // Render an error page or handle the error as needed
    }
};

// const getStatistics = async (req, res) => {
//     try {
//         const userCount = await User.countDocuments();
//         res.render('statistics', { count: userCount });
//     } catch (error) {
//         console.error('Error counting users:', error);
//         res.status(500).json({ error: 'Failed to fetch user count' });
//     }
// };

const getStatistics = async (req, res) => {
    try {
        // Count the number of users
        const userCount = await User.countDocuments();

        // Get best-selling products by revenue
        const bestSellers = await Product.aggregate([
            {
                $project: {
                    name: 1,
                    quantity: 1,  // Assuming you have a field for quantity
                    revenue: { $multiply: ["$price", "$no_sales"] }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Get most purchased products by number of sales
        const mostPurchased = await Product.find()
            .sort({ no_sales: -1 })
            .limit(4) // Limit to top 4 for display purposes
            .select('name no_sales');

        // Render the statistics view with user count, best sellers, and most purchased products
        res.render('statistics', { count: userCount, bestSellers, mostPurchased });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

module.exports = getStatistics;



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
        editProduct,
        getDashboard,
        getStatistics
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


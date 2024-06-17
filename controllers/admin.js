const User = require('../models/User');
const collections = require('../models/Collections');
const bcrypt = require('bcrypt');
const Product = require('../models/product');
const Order = require('../models/Orders');
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
            img
        });

        // Save the product to the database
        await newCollection.save();

        res.status(201).json({ message: 'Collection added successfully', data: newCollection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }res.status(500).json({ error: error.message });
    };

// const addCollection = async (req, res) => {
//     try {
//         const { CollectionName, CollectionDescription } = req.body;
//         const collectionImage = req.file; // Assuming the image file is sent as req.file
//         console.log(CollectionName);
//         console.log(CollectionDescription);
//         // Validate input
//         if (!CollectionName || !CollectionDescription) {
//             return res.status(400).json({ message: 'Collection name, description, required' });
//         }
//          if (!CollectionName || !CollectionDescription) {
//             return res.status(400).json({ message: 'Collection name, description, required' });
//         }


//         // Generate a unique filename for the uploaded image
//         const imgName = `${uuidv4()}-${collectionImage.originalname}`;
//         const imgPath = path.join(__dirname, '../images', imgName);

//         // Read the uploaded file and save it to the server
//         const fileContent = fs.readFileSync(collectionImage.path);
//         fs.writeFileSync(imgPath, fileContent);

//         // Delete the temporary file uploaded by the client
//         fs.unlinkSync(collectionImage.path);

//         // Create a new Collection object with image path
//         const newCollection = new collections({
//             Collection_Name: CollectionName,
//             Collection_Description: CollectionDescription,
//             imgPath: `/images/${imgName}` // Save image path relative to the server root
//         });

//         // Save the collection object to MongoDB
//         await newCollection.save();

//         res.status(201).json({ message: 'Collection added successfully', collection: newCollection });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Function to get all collections
// const getAllCollections = async (req, res) => {
//     try {
//         const allCollections = await collections.find();
//         res.render('collections', { collections: allCollections });
//     } catch (error) {
//         console.error('Error retrieving collections', error);
//         res.status(500).send('Error retrieving collections');
//     }
// };
const getCollections = async (req, res) => {
    try {
        const C = await collections.find({});
        res.render('EditLayout', { C });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to delete a collection
const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCollection = await collections.findByIdAndDelete(id);

        if (!deletedCollection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//edit collection on the server side
const editCollection = async (req, res) => {
    const { id, collectionName, description, launchDate } = req.body;

    try {
        await Collection.updateOne({ collection_id: id }, {
            Collection_Name: collectionName,
            Collection_Description: description,
            createdAt: new Date(launchDate)
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Failed to update collection', err);
        res.json({ success: false });
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
// editProduct 
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


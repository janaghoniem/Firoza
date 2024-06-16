const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');

// check if admin
<<<<<<< Updated upstream
router.use((req, res, next) => {
    if (req.session.user !== undefined && req.session.user.isAdmin) {
        next();
    }
    else {
        console.log(req.session.user);
        console.log('You are not an Admin')
    }
});
=======
// router.use((req, res, next) => {
//     if (req.session.user !== undefined && req.session.user.Type === 'admin') {
//         next();
//     }
//     else {
//        console.log('You are not an Admin')
//     }
// });
>>>>>>> Stashed changes

// Route to add a User
router.post('/addAdmin', adminController.addAdmin);

//Route to add collection
router.post('/addCollection', adminController.addCollection);
//Route to delete collection
//Route to edit collection

router.get('/users', adminController.GetAllUsers);

router.post('/addProduct', adminController.addProduct);



module.exports = router;

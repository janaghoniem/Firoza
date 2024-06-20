const express = require('express');
const router = express.Router();
const { getTopSellingProducts } = require('../controllers/User'); 

// router.get('/', (req, res) => {
//     res.render('landing-page');
// });

router.get('/', async (req, res) => {
    try {
        const topProducts = await getTopSellingProducts();
        res.render('Landing-page', { topProducts });
    } catch (error) {
        console.error('Error rendering landing page:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
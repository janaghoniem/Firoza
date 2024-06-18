const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
//const getcollection = require (../models/Collections);

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); 
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};
// const fetchCollections = async (req, res, next) => {
//     try {
//         const collections = await getcollection.find();
//         res.locals.collections = collections;
//         next();
//     } catch (error) {
//         console.error('Error fetching collections:', error);
//         res.locals.collections = [];
//         next();
//     }
// };
module.exports = fetchCollections;
module.exports = authMiddleware;

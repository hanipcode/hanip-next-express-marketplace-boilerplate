const router = require('express').Router();
const user = require('./user');
const productType = require('./productType');
const product = require('./product');

router.use('/user', user);
router.use('/product-type', productType);
router.use('/product', product);

module.exports = router;

const express = require('express');
const multer = require('multer');
const passportJWTCustomAuth = require('../helpers/passportJWTCustomAuth');

const router = express.Router();
const productController = require('../controllers/product');

const storage = multer.diskStorage({
  destination: 'static/public/product_images',
  fileFilter: function filter(__, file, callback) {
    const type = file.mimetype.split('/')[0];
    if (type === 'image') {
      callback(null, true);
    }
    callback(null, false);
  },
  filename: async function fileName(__, file, callback) {
    const extension = file.mimetype.split('/')[1];
    const filename = file.originalname.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const hash = `${filename}-${Date.now().toString()}`;
    callback(null, `${hash}.${extension}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product Management
 */

/**
 *@swagger
 *parameters:
 *  typeId:
 *    name: type_id
 *    in: formData
 *    description: id of the product type
 *    type: string
 *  productName:
 *    name: name
 *    in: formData
 *    description: name of the product type
 *    type: string
 *  productPrice:
 *    name: price
 *    in: formData
 *    description: product price
 *    type: number
 *  productStock:
 *    name: stock
 *    in: formData
 *    description: number of stock
 *    type: number
 *  productDescription:
 *    name: description
 *    in: formData
 *    description: product description
 *    type: string
 *  productLocationCoordinate:
 *    name: location_coordinate
 *    in: formData
 *    description: the coordinate string of product location
 *    type: string
 *  productLocationName:
 *    name: location_name
 *    in: formData
 *    description: the location name string (adress) of the product
 *    type: string
 *  productId:
 *    name: productId
 *    in: path
 *    description: product id
 *    type: string
 *  productImage:
 *    name: image
 *    in: formData
 *    description: Image of the product
 *    type: file
 */

/**
 * @swagger
 * /product:
 *  post:
 *    summary: Create new Product
 *    produces:
 *      - application/json
 *      - text/html
 *    parameters:
 *      - $ref: '#/parameters/typeId'
 *      - $ref: '#/parameters/productName'
 *      - $ref: '#/parameters/productPrice'
 *      - $ref: '#/parameters/productStock'
 *      - $ref: '#/parameters/productDescription'
 *      - $ref: '#/parameters/productLocationCoordinate'
 *      - $ref: '#/parameters/productLocationName'
 *      - $ref: '#/parameters/productImage'
 *    tags:
 *      - Product
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success create new product
 *  get:
 *    summary: Get lists of all product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    responses:
 *      200:
 *        description: success get list of new product
 *
 */
router
  .route('')
  .post(upload.single('image'), passportJWTCustomAuth, productController.createProduct);
router.route('').get(productController.getAllProduct);

/**
 * @swagger
 * /product/me:
 *  get:
 *    summary: Get lists of all current user product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success get list of new product
 *
 */
router.route('/me').get(passportJWTCustomAuth, productController.getProductByCurrentUserId);

/**
 * @swagger
 * /product/user/{userId}:
 *  get:
 *    summary: Get lists of {userId}'s product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    parameters:
 *      - $ref: '#/parameters/userId'
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success get list of new product
 *
 */
router.route('/user/:userId').get(passportJWTCustomAuth, productController.getProductByUserId);

/**
 * @swagger
 * /product/{productId}:
 *  get:
 *    summary: get detail of spesific product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    parameters:
 *      - $ref: '#/parameters/productId'
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: Successfully get detail of product
 *  put:
 *    summary: edit spesific product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    parameters:
 *      - $ref: '#/parameters/productId'
 *      - $ref: '#/parameters/productName'
 *      - $ref: '#/parameters/productPrice'
 *      - $ref: '#/parameters/productStock'
 *      - $ref: '#/parameters/productDescription'
 *      - $ref: '#/parameters/productLocationCoordinate'
 *      - $ref: '#/parameters/productLocationName'
 *      - $ref: '#/parameters/productImage'
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success get list of new product
 *  delete:
 *    summary: delete spesific product
 *    produces:
 *      - application/json
 *    tags:
 *      - Product
 *    parameters:
 *      - $ref: '#/parameters/productId'
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: Sucess delete product
 *
 */
router
  .route('/:productId')
  .put(upload.single('image'), passportJWTCustomAuth, productController.editProductPath);
router.route('/:productId').delete(passportJWTCustomAuth, productController.deleteProductPath);
router.route('/:productId').get(productController.getProductDetailById);

module.exports = router;

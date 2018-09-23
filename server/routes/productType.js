const express = require('express');
const passportJWTCustomAuth = require('../helpers/passportJWTCustomAuth');

const router = express.Router();
const productTypeController = require('../controllers/productType');

/**
 * @swagger
 * tags:
 *   name: Product Type
 *   description: Type of Product Management
 */

/**
 *@swagger
 *parameters:
 *  productTypeId:
 *    name: productTypeId
 *    in: path
 *    description: id of the product type
 *    type: string
 *  name:
 *    name: name
 *    in: formData
 *    description: name of the product type
 *    type: string
 *  userIdForm:
 *    name: userId
 *    in: formData
 *    description: userId in formData
 *    type: string
 */

/**
 * @swagger
 * /product-type:
 *  post:
 *    summary: Create new Product Type
 *    produces:
 *      - application/json
 *      - text/html
 *    parameters:
 *      - $ref: '#/parameters/name'
 *    tags:
 *      - Product Type
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success create new product type
 *  get:
 *    summary: Get lists of all product type
 *    produces:
 *      - application/json
 *    tags:
 *      - Product Type
 *    responses:
 *      200:
 *        description: success get list of new product type
 *
 */
router.route('').get(productTypeController.getProductTypeList);
router.route('').post(passportJWTCustomAuth, productTypeController.createProductType);

/**
 * @swagger
 * /product-type/{productTypeId}:
 *  get:
 *    summary: get Single Product Type
 *    produces:
 *      - application/json
 *      - text/html
 *    parameters:
 *      - $ref: '#/parameters/productTypeId'
 *    tags:
 *      - Product Type
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success create new product type
 *  delete:
 *    summary: delete single product type
 *    produces:
 *      - application/json
 *    parameters:
 *      - $ref: '#/parameters/productTypeId'
 *    tags:
 *      - Product Type
 *    security:
 *      - Bearer: []
 *    responses:
 *      200:
 *        description: success deleting product type
 */
router
  .route('/:productTypeId')
  .get(passportJWTCustomAuth, productTypeController.getSingleProductType);
router
  .route('/:productTypeId')
  .delete(passportJWTCustomAuth, productTypeController.deleteProductType);

module.exports = router;

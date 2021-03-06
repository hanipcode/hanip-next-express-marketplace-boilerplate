const express = require('express');
const multer = require('multer');
const passportJWTCustomAuth = require('../helpers/passportJWTCustomAuth');

const router = express.Router();
const userController = require('../controllers/user');

const storage = multer.diskStorage({
  destination: 'static/public/images',
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
 *   name: Users
 *   description: User management and login
 */

/**
 *@swagger
 *parameters:
 *  email:
 *    name: email
 *    in: formData
 *    description: name of the user
 *    type: string
 */

/**
 *@swagger
 *parameters:
 *  password:
 *    name: password
 *    in: formData
 *    description: password of the user
 *    type: string
 *    format: password
 *  first_name:
 *    name: first_name
 *    in: formData
 *    description: first name of the user
 *    type: string
 *  last_name:
 *    name: last_name
 *    in: formData
 *    description: last name of the user
 *    type: string
 *  phone_number:
 *    name: phone_number
 *    in: formData
 *    description: phone number of the user
 *    type: string
 *  location_coordinate:
 *    name: location_coordinate
 *    in: formData
 *    description: user coordinate string
 *    type: string
 *  location_name:
 *    name: location_name
 *    in: formData
 *    description: user address
 *    type: string
 *  profile_picture_image:
 *    name: profile_picture
 *    in: formData
 *    description: uploaded profile picture
 *    type: file
 *  id:
 *    name: id
 *    in: formData
 *    description: uuid of user
 *    type: string
 */

/**
 * @swagger
 * parameters:
 *  userId:
 *    name: userId
 *    in: path
 *    description: uuid of the user
 *    type: string
 */
/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */
/**
 *@swagger
 *definitions:
 *  User:
 *    type: object
 *    required:
 *      - email
 *      - accessToken
 *      - first_name
 *      - last_name
 *    properties:
 *      email:
 *        type: string
 *      accessToken:
 *        type: string
 *      username:
 *        type: string
 *      first_name:
 *        type: string
 *      last_name:
 *        type: string
 *      location_coordinate:
 *        type: string
 *      location_name:
 *        type: string
 *      phone_number:
 *        type: string
 *      _id:
 *        type: string
 */
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create new user (register)
 *     produces:
 *       - application/json
 *       - text/html
 *     parameters:
 *       - $ref: '#/parameters/email'
 *       - $ref: '#/parameters/password'
 *       - $ref: '#/parameters/first_name'
 *       - $ref: '#/parameters/last_name'
 *       - $ref: '#/parameters/phone_number'
 *       - $ref: '#/parameters/location_coordinate'
 *       - $ref: '#/parameters/location_name'
 *       - $ref: '#/parameters/profile_picture_image'
 *     tags:
 *        - Users
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *   put:
 *     summary: Edit user Profile
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *       - text/html
 *     parameters:
 *       - $ref: '#/parameters/id'
 *       - $ref: '#/parameters/email'
 *       - $ref: '#/parameters/password'
 *       - $ref: '#/parameters/first_name'
 *       - $ref: '#/parameters/last_name'
 *       - $ref: '#/parameters/phone_number'
 *       - $ref: '#/parameters/location_coordinate'
 *       - $ref: '#/parameters/location_name'
 *       - $ref: '#/parameters/profile_picture_image'
 *     tags:
 *        - Users
 *     responses:
 *       200:
 *         description: profile edited
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.route('').post(upload.single('profile_picture'), userController.createUser);
router
  .route('')
  .put(passportJWTCustomAuth, upload.single('profile_picture'), userController.editUser);

/**
 * @swagger
 * /user/auth:
 *   post:
 *     summary: User Login
 *     produces:
 *       - application/json
 *       - text/html
 *     parameters:
 *       - $ref: '#/parameters/email'
 *       - $ref: '#/parameters/password'
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.route('/auth').post(userController.loginUser);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Get specific user by user id
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/userId'
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: succesfully get
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: edit specific user by user id
 *     produces:
 *       - application/jsom
 *     parameters:
 *     - $ref: '#/parameters/userId'
 *     - $ref: '#/parameters/email'
 *     - $ref: '#/parameters/password'
 *     - $ref: '#/parameters/first_name'
 *     - $ref: '#/parameters/last_name'
 *     - $ref: '#/parameters/phone_number'
 *     - $ref: '#/parameters/location_coordinate'
 *     - $ref: '#/parameters/location_name'
 *     - $ref: '#/parameters/profile_picture_image'
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: succesfully edit user
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *
 */
router.route('/:userId').get(passportJWTCustomAuth, userController.getSingleUser);
router
  .route('/:userId')
  .put(passportJWTCustomAuth, upload.single('profile_picture'), userController.editUserPath);
module.exports = router;

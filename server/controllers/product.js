// @flow
import typeof { Request, Response } from 'express';
import { ProductCreateParam, ProductCreatPayload, ProductEditParam } from '../models/Types/Product';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const getJWTToken = require('../helpers/getJWTToken');
const Product = require('../models/Product');
const User = require('../models/User');

async function createProduct(req: Request, res: Response) {
  const token = getJWTToken(req.headers.authorization);
  const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
  const param: ProductCreateParam = req.body;
  const user = await User.findById(jwtPayload._id);
  const { file } = req;

  if (!user) {
    res.status(404).send({
      error: true,
      message: 'User Tidak Ditemukan',
    });
    return;
  }
  const productCreatePayload: ProductCreatPayload = {
    _id: mongoose.Types.ObjectId(),
    type: param.type_id,
    user: jwtPayload._id,
    name: param.name,
    price: param.price,
    stock: param.stock,
    description: param.description,
    location_coordinate: param.location_coordinate,
    location_name: param.location_name,
  };

  let finalPayload;
  if (file) {
    const thumbnailFile = await sharp(file.path)
      .resize(200, null)
      .flatten()
      .toFile(path.join(`${__dirname}../../../static/public/product_thumbnail/${file.filename}`));
    if (!thumbnailFile) {
      res.send({
        error: true,
        message: 'Failed when upload your product picture',
      });
      return;
    }
    finalPayload = Object.assign(productCreatePayload, {
      image: file.path.replace('static/', '').replace('/product_images/', '/product_thumbnail/'),
    });
  } else {
    finalPayload = productCreatePayload;
  }
  try {
    const newProduct = new Product(finalPayload);
    const data = await newProduct.save();
    if (data) {
      user.products.push(data._id);
      await user.save();
      res.status(200).send({
        message: 'Successfully create product',
        data,
      });
      return;
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error,
    });
    return;
  }
  res.status(500).send({
    message: 'unexpected error',
    error: true,
  });
}

async function getAllProduct(req: Request, res: Response) {
  const products = await Product.find()
    .populate('user')
    .populate('type');
  if (products) {
    res.status(200).send({
      message: 'Sucessfully list all product',
      data: products,
    });
    return;
  }
  res.status(500).send({
    message: 'unexpected error',
    error: true,
  });
}

async function getProductDetailById(req: Request, res: Response) {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
    })
      .populate('type')
      .populate('user');
    if (!product) {
      res.status(404).send({
        error: true,
        message: 'Product Tidak Ditemukan',
      });
      return;
    }
    res.status(200).send({
      message: 'Successfully get Product',
      data: product,
    });
  } catch (error) {
    if (error.path === '_id') {
      res.status(404).send({
        message: 'Produk tidak ditemukan',
        error: true,
        trace: error,
      });
      return;
    }
    res.status(500).send({
      message: 'unexpected error',
      error: true,
      trace: error,
    });
  }
}

async function getProductByCurrentUserId(req: Request, res: Response) {
  const token = getJWTToken(req.headers.authorization);
  const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
  const userProduct = await Product.find({
    user: jwtPayload._id,
  }).populate('type');
  if (!userProduct) {
    res.status(404).send({
      error: true,
      message: 'User tidak ditemukan',
    });
    return;
  }
  if (userProduct) {
    res.status(200).send({
      message: 'Successfully get user by product id',
      data: userProduct,
    });
    return;
  }
  res.status(500).send({
    message: 'unexpected error',
    error: true,
  });
}

async function getProductByUserId(req: Request, res: Response) {
  const { userId } = req.params;
  const userProduct = await Product.find({
    user: userId,
  }).populate('type');
  if (!userProduct) {
    res.status(404).send({
      error: true,
      message: 'User tidak ditemukan',
    });
    return;
  }
  if (userProduct) {
    res.status(200).send({
      message: 'Successfully get user by product id',
      data: userProduct,
    });
    return;
  }
  res.status(500).send({
    message: 'unexpected error',
    error: true,
  });
}

async function editProductPath(req: Request, res: Response) {
  const { productId } = req.params;
  const param: ProductEditParam = req.body;
  const { file } = req;
  let finalPayload;
  if (file) {
    const thumbnailFile = await sharp(file.path)
      .resize(200, null)
      .flatten()
      .toFile(path.join(`${__dirname}../../../static/public/product_thumbnail/${file.filename}`));
    if (!thumbnailFile) {
      res.send({
        error: true,
        message: 'Failed when upload your product picture',
      });
      return;
    }
    finalPayload = Object.assign(param, {
      image: file.path.replace('static/', '').replace('/product_images/', '/product_thumbnail/'),
    });
  } else {
    finalPayload = param;
  }
  try {
    const savedProduct = await Product.findOneAndUpdate({ _id: productId }, finalPayload, {
      new: true,
    });
    if (!savedProduct) {
      res.status(404).send({
        error: true,
        message: 'Product Not Found',
      });
    }
    res.send({ message: 'successfully edit product data', data: savedProduct });
  } catch (error) {
    res.status(500).send({ error: true, message: `Unexpected Error ${error}` });
  }
}

async function deleteProductPath(req: Request, res: Response) {
  const { productId } = req.params;
  try {
    const deletedProduct = await Product.findOneAndRemove({ _id: productId });
    if (!deletedProduct) {
      res.status(404).send({
        error: true,
        message: 'Product Not Found',
      });
    }
    res.send({ message: 'successfully delete product data', data: deletedProduct });
  } catch (error) {
    res.status(500).send({ error: true, message: `Unexpected Error ${error}` });
  }
}

module.exports = {
  createProduct,
  getAllProduct,
  getProductByCurrentUserId,
  getProductByUserId,
  editProductPath,
  deleteProductPath,
  getProductDetailById,
};

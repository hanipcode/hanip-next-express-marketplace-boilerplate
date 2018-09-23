// @flow
import typeof { Request, Response } from 'express';
import {
  ProductTypeModel,
  ProductTypePayload,
  ProductTypeCreateParam,
} from '../models/Types/ProductType';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const getJWTToken = require('../helpers/getJWTToken');
const ProductType = require('../models/ProductType');
const User = require('../models/User');

async function createProductType(req: Request, res: Response) {
  const token = getJWTToken(req.headers.authorization);
  const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
  const param: ProductTypeCreateParam = req.body;
  const user = await User.findById(jwtPayload._id);
  if (!user) {
    res.status(404).send({
      error: true,
      message: 'User Tidak Ditemukan',
    });
    return;
  }
  if (!param.name) {
    res.status(400).send({
      error: true,
      message: 'Nama Tidak Boleh Kosong',
    });
    return;
  }
  const productTypePayload: ProductTypePayload = {
    _id: mongoose.Types.ObjectId(),
    name: param.name,
  };
  const productType = new ProductType(productTypePayload);
  const data = await productType.save();
  if (data) {
    res.status(200).send({
      data,
      message: 'Sucessfully created product type',
    });
    return;
  }
  res.status(500).send({
    message: 'there is an unexpected error',
    error: true,
  });
}

async function getProductTypeList(req: Request, res: Response) {
  const productTypeList = await ProductType.find();
  if (productTypeList) {
    res.status(200).send({
      message: 'Success get product type list data',
      data: productTypeList,
    });
    return;
  }
  res.status(404).send({
    message: 'No Product type list found',
    error: true,
  });
}

async function getSingleProductType(req: Request, res: Response) {
  const { productTypeId } = req.params;
  const productTypeItem = await ProductType.findById(productTypeId);
  if (!productTypeItem) {
    res.status(404).send({
      message: 'No Product type with that id found',
      error: true,
    });
    return;
  }
  res.status(200).send({
    message: 'Success get single product',
    data: productTypeItem,
  });
}

async function deleteProductType(req: Request, res: Response) {
  const { productTypeId } = req.params;
  const removedItem = await ProductType.findByIdAndRemove(productTypeId);
  if (!removedItem) {
    res.status(404).send({
      message: 'No Product type with that id found',
      error: true,
    });
    return;
  }
  res.status(200).send({
    message: 'Success deleteing data',
    data: removedItem,
  });
}

module.exports = {
  createProductType,
  getProductTypeList,
  getSingleProductType,
  deleteProductType,
};

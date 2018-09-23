import { UserModelPayload, UserModelType } from '../models/Types/User';
import UserTransformers from '../helpers/transformer/UserTransformers';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const path = require('path');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/User');

export type UserRegistrationParam = {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  location_coordinate?: string,
  location_name?: string,
  profile_picture?: File,
};

export type UserEditParam = {
  id: string,
  email?: string,
  password?: string,
  first_name?: string,
  last_name?: string,
  phone_number?: string,
  location_coordinate?: string,
  location_name?: string,
  profile_picture?: File,
};

export type UserLoginParam = {
  email: string,
  password: string,
};

export async function createUser(req: Request, res: Response) {
  const param: UserRegistrationParam = req.body;
  const { file } = req;
  try {
    const hashedPassword = await bcrypt.hash(param.password, 10);
    const userWithEmailOrPassword = await User.findOne({
      $or: [{ email: param.email }, { phone_number: param.phone_number }],
    });
    if (userWithEmailOrPassword) {
      res.status(400).send({
        error: true,
        message: 'User dengan email atau nomer handphone yang anda masukan telah terdaftar',
      });
    }
    const userPayload: UserModelPayload = {
      _id: mongoose.Types.ObjectId(),
      email: param.email,
      password: hashedPassword,
      first_name: param.first_name,
      last_name: param.last_name,
      phone_number: param.phone_number,
      location_coordinate: param.location_coordinate,
      location_name: param.location_name,
    };
    let finalPayload;
    if (file) {
      const thumbnailFile = await sharp(file.path)
        .resize(200, null)
        .flatten()
        .toFile(path.join(`${__dirname}../../../static/public/thumbnail/${file.filename}`));
      if (!thumbnailFile) {
        res.send({
          error: true,
          message: 'Failed when upload your profile picture',
        });
        return;
      }
      finalPayload = Object.assign(userPayload, {
        profile_picture: file.path.replace('static/', '').replace('/images/', '/thumbnail/'),
      });
    } else {
      finalPayload = userPayload;
    }

    const user = new User(finalPayload);
    const data = await user.save();
    const returnedUserData = UserTransformers(data);
    res.status(201).send({ message: 'Successfully created new user', data: returnedUserData });
  } catch (error) {
    res.status(500).send({ error });
  }
}

export async function getSingleUser(req: Request, res: Response) {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).populate('products');
  if (!user) {
    res.status(404).send({
      error: true,
      message: 'User Not Found',
    });
  }
  const returnedUserData = UserTransformers(user);
  res.status(200).send({
    message: 'Sucessfully get user',
    data: returnedUserData,
  });
}

export async function loginUser(req: Request, res) {
  const param: UserLoginParam = req.body;
  try {
    const user = await User.findOne({ email: param.email });
    if (!user) {
      res.status(401).send({
        error: true,
        message: 'User dengan email tersebut tidak ditemukan',
      });
    }
    const isCorrectPassword = await bcrypt.compare(param.password, user.password);
    if (!isCorrectPassword) {
      res.status(401).send({
        error: true,
        message: 'User dengan password tersebut tidak ditemukan',
      });
    }
    const accessToken = jwt.sign(
      {
        email: user.email,
        // eslint-disable-next-line
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1d',
      },
    );
    const returnedUserData = UserTransformers(user);
    res.status(200).send({
      message: 'Successfully Logged In',
      data: {
        user: returnedUserData,
        accessToken,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).send({ error: true, message: `Unexpected Error ${error}` });
  }
}

export async function editUser(req: Request, res: Response) {
  const param: UserEditParam = req.body;
  const { file } = req;
  // const user: UserModelType = await User.findOne({ _id: param._id });
  let payload;
  if (file) {
    payload = Object.assign(param, { profile_picture: file.path.replace('static/', '') });
  } else {
    payload = param;
  }
  try {
    const savedUser = await User.findOneAndUpdate({ _id: param.id }, payload, { new: true });
    if (!savedUser) {
      res.status(404).send({
        error: true,
        message: 'User not found',
      });
    }
    const returnedUser = UserTransformers(savedUser);
    res.send({ message: 'successfully edit user profile', data: returnedUser });
  } catch (error) {
    res.status(500).send({ error: true, message: `Unexpected Error ${error}` });
  }
}

export async function editUserPath(req: Request, res: Response) {
  const { userId } = req.params;
  const param: UserEditParam = req.body;
  const { file } = req;
  let payload;
  if (file) {
    const thumbnailFile = await sharp(file.path)
      .resize(200, null)
      .flatten()
      .toFile(path.join(`${__dirname}../../../static/public/thumbnail/${file.filename}`));
    if (!thumbnailFile) {
      res.send({
        error: true,
        message: 'Failed when upload your profile picture',
      });
      return;
    }
    payload = Object.assign(param, {
      profile_picture: file.path.replace('static/', '').replace('/images/', '/thumbnail/'),
    });
  } else {
    payload = param;
  }
  try {
    const savedUser = await User.findOneAndUpdate({ _id: userId }, payload, { new: true });
    if (!savedUser) {
      res.status(404).send({
        error: true,
        message: 'User not found',
      });
      return;
    }
    const returnedUser = UserTransformers(savedUser);
    res.send({ message: 'successfully edit user profile', data: returnedUser });
    return;
  } catch (error) {
    res.status(500).send({ error: true, message: `Unexpected Error ${error}` });
  }
}

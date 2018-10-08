import { ProductTypeType } from './ProductType';
import { UserModelType } from './User';

export type ProductFlowType = {
  _id: string,
  type: ProductTypeType,
  user: UserModelType,
  name: string,
  price: number,
  price_unit_name: string,
  image: string,
  stock: number,
  stock_unit_name: string,
  description: string,
  location_coordinate?: string,
  location_name?: string,
};

export type ProductCreateParam = {
  type: string,
  user: string,
  name: string,
  price: number,
  price_unit_name: string,
  stock: number,
  stock_unit_name: string,
  image: File,
  description: string,
  location_coordinate?: string,
  location_name?: string,
};

export type ProductEditParam = {
  name?: string,
  price?: number,
  stock?: number,
  image: File,
  description?: string,
  location_coordinate?: string,
  location_name?: string,
};

export type ProductCreatPayload = {
  _id: string,
  type: string,
  user: string,
  name: string,
  price: number,
  stock: number,
  description: string,
  location_coordinate?: string,
  location_name?: string,
  image: string,
};

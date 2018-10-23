import fetch from 'isomorphic-unfetch';
import {
  DEFAULT_HEADER, buildResponse, buildPath, buildHeader,
} from './helper';

export function createProductApi(
  accessToken: string,
  typeId: string,
  name: string,
  price: number,
  priceUnitName: string,
  stockUnitName: string,
  stock: number,
  description: string,
  productImage: File[],
) {
  const formData = new FormData();
  formData.append('type_id', typeId);
  formData.append('name', name);
  formData.append('price', price);
  formData.append('price_unit_name', priceUnitName);
  formData.append('stock_unit_name', stockUnitName);
  formData.append('stock', stock);
  formData.append('description', description);
  productImage.forEach((imageData) => {
    formData.append('image', imageData, imageData.name);
  });
  return fetch(buildPath('/api/v1/product'), {
    method: 'POST',
    body: formData,
    headers: buildHeader(accessToken, true),
  }).then(buildResponse);
}

export function editProductApi(
  accessToken: string,
  productId,
  name: string,
  price: number,
  priceUnitName: string,
  stockUnitName: string,
  stock: number,
  description: string,
) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('price_unit_name', priceUnitName);
  formData.append('stock_unit_name', stockUnitName);
  formData.append('stock', stock);
  formData.append('description', description);
  return fetch(buildPath(`/api/v1/product/${productId}`), {
    method: 'PUT',
    body: formData,
    headers: buildHeader(accessToken, true),
  }).then(buildResponse);
}

export function getAllProductApi(accessToken: string) {
  return fetch(buildPath('/api/v1/product'), {
    headers: buildHeader(accessToken),
  }).then(buildResponse);
}

export function getCurrentUserProductApi(accessToken: string) {
  return fetch(buildPath('/api/v1/product/me'), {
    headers: buildHeader(accessToken),
  }).then(buildResponse);
}

export function deleteProductApi(accessToken: string, productId: string) {
  return fetch(buildPath(`/api/v1/product/${productId}`), {
    headers: buildHeader(accessToken),
    method: 'DELETE',
  }).then(buildResponse);
}

export function getProductDetailApi(accessToken: string, productId: string) {
  return fetch(buildPath(`/api/v1/product/${productId}`), {
    headers: buildHeader(accessToken),
  }).then(buildResponse);
}

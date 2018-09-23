import fetch from 'isomorphic-unfetch';
import {
  DEFAULT_HEADER, buildResponse, buildPath, buildHeader,
} from './helper';

export function createProductApi(
  accessToken: string,
  typeId: string,
  name: string,
  price: number,
  stock: number,
  description: string,
  productImage: File,
) {
  const formData = new FormData();
  formData.append('type_id', typeId);
  formData.append('name', name);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('description', description);
  formData.append('image', productImage, productImage.name);
  return fetch(buildPath('/api/v1/product'), {
    method: 'POST',
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
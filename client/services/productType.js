import fetch from 'isomorphic-unfetch';
import {
  DEFAULT_HEADER, buildResponse, buildPath, buildHeader,
} from './helper';

// eslint-disable-next-line
export function fetchProductTypeApi(accessToken) {
  return fetch(buildPath('/api/v1/product-type'), {
    headers: buildHeader(accessToken),
  }).then(buildResponse);
}

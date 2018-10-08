import { fetchProductTypeApi } from '../services/productType';

const SET_PRODUCT_TYPE = 'productType/setProductType';
const SET_PRODUCT_TYPE_LOADING = 'productType/setProductTypeLoading';

export function setProductTypeLoading(isLoading) {
  return {
    type: SET_PRODUCT_TYPE_LOADING,
    isLoading,
  };
}

export function setProductTypeState(productTypeList) {
  return {
    type: SET_PRODUCT_TYPE,
    productTypeList,
  };
}

export function fetchProductTypeState(accessToken) {
  return async (dispatch) => {
    dispatch(setProductTypeLoading(true));
    const productTypeResponse = await fetchProductTypeApi(accessToken);
    const { data } = productTypeResponse;
    dispatch(setProductTypeState(data));
    dispatch(setProductTypeLoading(false));
  };
}

const initialState = {
  productTypeList: [],
  isLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT_TYPE:
      return {
        ...state,
        productTypeList: action.productTypeList,
      };
    case SET_PRODUCT_TYPE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
}

export const getProductTypeListState = state => state.productTypeList;
export const getProductTypeLoadingState = state => state.isLoading;

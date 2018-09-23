import { fetchProductTypeApi } from '../services/productType';

const SET_PRODUCT_TYPE = 'productType/setProductType';

export function setProductTypeState(productTypeList) {
  return {
    type: SET_PRODUCT_TYPE,
    productTypeList,
  };
}

export function fetchProductTypeState(accessToken) {
  return (dispatch) => {
    fetchProductTypeApi(accessToken).then((response) => {
      const { data } = response;
      console.log(data);
      dispatch(setProductTypeState(data));
    });
  };
}

const initialState = {
  productTypeList: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT_TYPE:
      return {
        ...state,
        productTypeList: action.productTypeList,
      };
    default:
      return state;
  }
}

export const getProductTypeListState = state => state.productTypeList;

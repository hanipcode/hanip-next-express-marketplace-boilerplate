import { combineReducers } from 'redux';
import userReducer from './user';
import productTypeReducer from './productType';

export default combineReducers({
  userState: userReducer,
  productTypeState: productTypeReducer,
});

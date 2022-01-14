//here we want to combine all of our reducers to this one file to make things cleaner
import { combineReducers } from "redux";
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    item: itemReducer,
    error: errorReducer,
    auth: authReducer
})
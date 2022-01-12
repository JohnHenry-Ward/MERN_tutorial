//here we want to combine all of our reducers to this one file to make things cleaner
import { combineReducers } from "redux";
import itemReducer from './itemReducer';

export default combineReducers({
    item: itemReducer
})
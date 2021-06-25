// rootReducer에 Reducer들을 합체
import { combineReducers } from "redux";
import user from './user_reducer';

const rootReducer = combineReducers({
    user,
})

export default rootReducer;
import { combineReducers } from 'redux';

import PostUploadReducer from './PostUploadReducer';
import PostListReducer from './PostListReducer';

const reducers = combineReducers({
  PostUploadReducer,
  PostListReducer,
})

export default reducers;
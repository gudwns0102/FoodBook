import * as actionTypes from '../actions/actionTypes';

function PostUploadReducer(state = {isUploading: false}, action){
  switch(action.type){
    case actionTypes.POST_UPLOAD_START:
      return {...state, isUploading: true}
    
    case actionTypes.POST_UPLOAD_END:
      return {...state, isUploading: false}

    default:
      return {...state}
  }
}

export default PostUploadReducer;
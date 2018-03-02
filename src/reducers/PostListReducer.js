import * as actionTypes from '../actions/actionTypes';
import array from 'lodash/array';

function PostListReducer(state = {postList: []}, action){
  switch(action.type){
    case actionTypes.FETCH_POST_LIST:{
      return {...state, postList: action.postList}
    }

    case actionTypes.INSERT_POST_OBJECT:{
      const duplicate = state.postList;
      var index = array.sortedIndexBy(state.postList, action.postObject, item => {return -item.createdAt})
      
      if (index == -1){
        index = duplicate.length
      }
      
      duplicate.splice(index, 0, action.postObject);

      return {...state, postList: duplicate}
    }

    default: 
      return {...state}
  }
}

export default PostListReducer;
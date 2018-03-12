import * as actionTypes from '../actions/actionTypes';
import array from 'lodash/array';

function PostListReducer(state = {postList: []}, action){
  switch(action.type){
    case actionTypes.FETCH_POST_LIST:
      return Object.assign({}, state, { postList: action.postList })

    case actionTypes.INSERT_POST_OBJECT:{
      const duplicate = state.postList;
      var index = array.sortedIndexBy(duplicate, action.postObject, item => {return -item.createdAt})
      
      if (index == -1){
        index = duplicate.length
      }
      
      duplicate.splice(index, 0, action.postObject);

      return Object.assign({}, state, { postList: duplicate })
    }
    
    case actionTypes.DELETE_POST_OBJECT: {
      const duplicate = state.postList;
      const index = array.findIndex(duplicate, postObject => { return postObject.id == action.postObject.id })
      console.log('Index is ', index);

      console.log(duplicate);

      duplicate.splice(index, 1);

      console.log(duplicate);

      return Object.assign({}, state, { postList: duplicate })
    }

    default: 
      return state;
  }
}

export default PostListReducer;
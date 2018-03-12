import * as actionTypes from './actionTypes';

function postUploadStart(){
  return {
    type: actionTypes.POST_UPLOAD_START
  }
}

function postUploadEnd(){
  return {
    type: actionTypes.POST_UPLOAD_END
  }
}

function fetchPostList(postList){
  return {
    type: actionTypes.FETCH_POST_LIST,
    postList,
  }
}

function insertPostObject(postObject){
  console.log('insertPostObject')
  return {
    type: actionTypes.INSERT_POST_OBJECT,
    postObject,
  }
}

function deletePostObject(postObject){
  console.log('deletePostObject')
  return {
    type: actionTypes.DELETE_POST_OBJECT,
    postObject,
  }
}

export {
  postUploadStart,
  postUploadEnd,
  fetchPostList,
  insertPostObject,
  deletePostObject,
}
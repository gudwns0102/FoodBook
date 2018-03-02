import React from 'react'
import { 
  View, 
  Text, 
  Modal,  
  Image,
  FlatList,
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  BackHandler,
  CameraRoll
} from 'react-native';

import { withNavigation } from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { FBText } from '../components';

import { ShareDialog } from 'react-native-fbsdk';

import RNFS from 'react-native-fs';

import ImagePicker from 'react-native-image-picker';

/* Redux related modules */
import * as actions from '../actions';
import { connect } from 'react-redux';
import PhotoView from 'react-native-photo-view';


class GalleryScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      slideVisible: false,
      targetPost: null,
      index: 0,
    }
  }

  toggleSlide = () => this.setState({slideVisible: !this.state.slideVisible});

  scrollToIndex = (index) => this._gallery.scrollToIndex(index);

  handleBackButton = () => {
    const { slideVisible } = this.state;

    if(slideVisible){
      this.setState({slideVisible: false})
      return true;
    } 

    return false;
  }
  /* Facebook sdk doesn't take imageUrl as remote url... 
     and android sharing requests image uri which is accessible, (= not local uri)
     so I should download remote image in Camera roll.
     but I can't find direct way to do it, so it takes some waste in performance...
    1. Download image from remote url to local directory using RNFS
    2. Move local image to Camera roll.
    3. Share the image in Camera roll.
    4. Delete local & camera roll images. 
  */

  handleShare = async () => {
    
    const { postList } = this.props;
    const { index } = this.state;

    // 1. Download image from remote url.
    const localuri = RNFS.CachesDirectoryPath + '/' + postList[index].get("photo").name();
    const options = {
      fromUrl: postList[index].get("photo").url(),
      toFile: localuri,
      progress: ({jotId, contentLength, bytesWritten}) => {
        console.log("Current download percent: ", Math.round(bytesWritten/contentLength*100));
      },
      progressDivider: 10,
    }

    const removeFile = (uri) => {
      console.log("FILE DELETE START: ", uri);
      RNFS.unlink(localuri)
      .then(() => console.log('FILE DELETED'))
      .catch((err) => {console.log('removeCachedFile failed!'); console.log(err)});
    }

    const { jobId, promise } = RNFS.downloadFile(options);
    const { statusCode, bytesWritten } = await promise;

    // If download is successful, statusCode will be 200
    if (statusCode == 200){

      try {
        const uri = await CameraRoll.saveToCameraRoll(localuri, "photo");
        
        removeFile(localuri);
        
        const sharePhotoContent = {
          contentType: 'photo',
          photos: [
            {
              imageUrl: uri,
              userGenerated: false,
              caption: "Hello World!"
            }
          ]
        };

        const canShow = await ShareDialog.canShow(sharePhotoContent);
        
        if(canShow){
          ShareDialog.show(sharePhotoContent)
          .then(result => {
            if(result.isCancelled) alert('Share cancelled')
            else alert("Share success with postID: ", result.postId)
            
            removeFile(uri);
          },
          error => {
            alert("error: ", error.message)
            console.log(error)
            removeFile(uri)
          })
          .catch(error => {
            console.log(error)
            removeFile(uri);
          })
        } else {
          removeFile(uri);
        }
      } catch(error) {
        console.log(error);
        removeFile(uri);
      }
    } else {
      console.log(statusCode);
      alert("Download your photo was not successful... Try again!");
      removeFile(uri);
    }
  };

  render(){
    const { navigation } = this.props;
    const { width, height } = Dimensions.get('window');

    if (this.props.postList.length == 0){
      return (
        <View style={{width: '100%', flex: 1, alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity 
            style={{width:'80%', height: '30%',  alignItems:'center', justifyContent:'center', borderWidth: 1, borderColor:'gray', borderRadius: 10}}
            onPress={() => navigation.navigate('PostAddScreen')}>
            <FBText>Oops! No post yet...</FBText>
            <FBText>Let's make first post!</FBText>
          </TouchableOpacity>
        </View>
      );
    }

    return(
      <View style={{width:'100%', flex: 1}}>
        <TouchableOpacity style={{width:'100%', height: 50}} onPress={this.handleShare}>
          <FBText>Share!</FBText>
        </TouchableOpacity>
        <FlatList
          data={this.props.postList}
          renderItem={({item, index}) => (
            <TouchableOpacity 
              key={index} 
              style={{width: width/3, height: width/3, padding: width/200}}
              onPress={() => {
                this.setState({index});
                this.toggleSlide();
              }}>
              <Image style={{width: '100%', flex: 1}} resizeMode='cover' source={{uri: item.get("preview").url()}}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index}
          numColumns={3}
          //initialNumToRender={15}
          windowSize={50}
        />
        <Modal
          visible={this.state.slideVisible}
          onRequestClose={this.toggleSlide}
        >
          <FlatList
            //ref={ref => this._gallery = ref}
            horizontal
            data={this.props.postList}
            renderItem={({item, index}) => 
              <PhotoView
                
                source={{uri: item.get("photo").url()}}
                minimumZoomScale={1}
                maximumZoomScale={3}
                androidScaleType="fitCenter"
                resizeMode='contain'
                style={{width, height, backgroundColor:'black'}}
              />
            }
            pagingEnabled
            windowSize={5}
            getItemLayout={(data, index) => ({length: width, offset: width*index, index})}
            initialScrollIndex={this.state.index}
            initialNumToRender={0}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={true}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

const mapStateToProps = (state) => {
  return {
    postList: state.PostListReducer.postList,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostList: postList => dispatch(actions.fetchPostList(postList)),
    insertPostObject: postObject => dispatch(actions.insertPostObject(postbject)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(GalleryScreen));
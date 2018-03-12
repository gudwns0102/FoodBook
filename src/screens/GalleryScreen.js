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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FBText } from '../components';
import { ShareDialog } from 'react-native-fbsdk';
import RNFS from 'react-native-fs';
import Parse from 'parse/react-native';

/* Redux related modules */
import * as actions from '../actions';
import { connect } from 'react-redux';
import PhotoView from 'react-native-photo-view';

const { width, height } = Dimensions.get('window');

class GalleryScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      postList: this.props.postList,
      slideVisible: false,
      targetPost: null,
      index: 0,
      mode: 'photo'
    }

    this.viewabilityConfig = {viewAreaCoveragePercentThreshold: 100}
  }

  toggleSlide = () => this.setState({slideVisible: !this.state.slideVisible});

  handleBackButton = () => {
    const { slideVisible } = this.state;

    if(slideVisible){
      this.setState({slideVisible: false})
      return true;
    } 

    return false;
  }
  /* Facebook sdk doesn't take imageUrl as remote url... 
    1. Download image from remote url to local directory using RNFS
    2. Share the image through provider of react-native-image-picker.
    3. Delete local & camera roll images. 
  */

  handleShare = async () => {
    
    const { postList } = this.props;
    const { index } = this.state;

    // 1. Download image from remote url.
    const localuri = RNFS.ExternalStorageDirectoryPath + '/' + postList[index].get("photo").name();
    const options = {
      fromUrl: postList[index].get("photo").url(),
      toFile: localuri,
      progress: ({jotId, contentLength, bytesWritten}) => {
        console.log("Current download percent: ", Math.round(bytesWritten/contentLength*100));
      },
      progressDivider: 10,
    }

    const removeFile = () => {
      console.log("FILE DELETE START: ", localuri);
      RNFS.unlink(localuri)
      .then(() => console.log('FILE DELETED'))
      .catch((err) => {console.log('removeCachedFile failed!'); console.log(err)});
    }

    const { jobId, promise } = RNFS.downloadFile(options);
    const { statusCode, bytesWritten } = await promise;

    // If download is successful, statusCode will be 200
    if (statusCode == 200){

      try {
        const uri = 'content://com.foodbook.provider/app_images/' + postList[index].get("photo").name();
        
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

  handleRemove = () => {
    const { navigation } = this.props;
    const local_postObject = this.state.postList[this.state.index];
    console.log(local_postObject.id);
    Parse.Cloud.run('deletePost', {postID: local_postObject.id})
    .then(postObject => {
      this.toggleSlide();
      this.props.deletePostObject(local_postObject);
      //setTimeout(() => this.setState({postList: this.props.postList}), 100);
    })
    .catch(error => {
      console.log(error.message.message);
    })
  }

  componentDidMount(){
  }

  
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    console.log("Props changed!");
    if(nextProps.postList != this.state.postList){
      this.setState({postList: nextProps.postList});
    }
  }

  changeMode = (mode) => {
    this.setState({mode});
  }

  photoView = ({item, index}) => (
    <PhotoView
      source={{uri: item.get("photo").url()}}
      minimumZoomScale={1}
      maximumZoomScale={3}
      androidScaleType="fitCenter"
      style={{width, height}}
    />
  );

  postView = ({item, index}) => (
    <View style={{width, height}}>
      <FBText style={{color:'white'}}>Hello</FBText>
      <PhotoView
        source={{uri: item.get("photo").url()}}
        minimumZoomScale={1}
        maximumZoomScale={3}
        androidScaleType="fitCenter"
        style={{width: 100, height:100}}
      />
    </View>
  );

  onViewableItemsChanged = ({viewableItems, changed}) => {
    const {index, isViewable} = changed[0];
    if(isViewable == true){
      this.setState({index});
    }
  }

  render(){
    const { navigation } = this.props;

    if (!this.state.postList){
      <View>
        <FBText>We are loading postlist...</FBText>
      </View>
    }

    if (this.state.postList.length == 0){
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
        <FlatList
          data={this.state.postList}
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
          <View style={{width:'100%', flex: 1, backgroundColor:'black'}}>
            <View style={{width:'100%', position:'absolute'}}>
              <FlatList
                //ref={ref => this._gallery = ref}
                horizontal
                data={this.state.postList}
                renderItem={this.state.mode == 'photo' ? this.photoView : this.postView}
                pagingEnabled
                windowSize={5}
                getItemLayout={(data, index) => ({length: width, offset: width*index, index})}
                initialScrollIndex={this.state.index}
                initialNumToRender={0}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={this.viewabilityConfig}
              />    
            </View>    
            <View style={{width:'100%', flexDirection:'row', padding:'2%', alignItems:'center', justifyContent:'flex-end'}}>
              <TouchableOpacity style={{marginHorizontal: '1%'}} onPress={this.handleRemove}>
                <Ionicons name='md-trash' color='white' size={30} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: '1%'}} onPress={this.handleShare}>
                <Ionicons name='ios-share-alt' color='white' size={30} />
              </TouchableOpacity>
              <TouchableOpacity style={{marginHorizontal: '1%'}} onPress={() => this.changeMode(this.state.mode == 'photo' ? 'post' : 'photo')}>
                <FontAwesome name={this.state.mode == 'photo' ? 'compress' : 'expand'} color='white' size={30} />
              </TouchableOpacity>
            </View>
          </View>
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
    deletePostObject: postObject => dispatch(actions.deletePostObject(postObject)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(GalleryScreen));
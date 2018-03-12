import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  BackHandler, 
  Alert, 
  ToastAndroid,
  ImageEditor
} from 'react-native';

import { withNavigation } from 'react-navigation';

import Swiper from 'react-native-swiper';
import Parse from 'parse/react-native';

import PhotoScreen from './PhotoScreen';
import InfoScreen from './InfoScreen';

import RNFS from 'react-native-fs';

/* Redux related modules */
import * as actions from '../actions';
import { connect } from 'react-redux';

const PREVIEW_WIDTH_SIZE = 200;
/* Post Add flow 
  1. select photo through Camera or Gallery. 
  2. Additional info like description, location is typed
  3. When submit button is clicked,
    3.1 create preview image 
    3.2 submit photo & preview on Parse server
*/

class PostAddScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentIndex: 0,

      uri: null,
      width: null,
      height: null,
      base64: null,

      place: null,
      description: null,

      previewBase64: null,
    }
  }

  incrementPageIndex = () => this.swiper.scrollBy(1, true);
  decrementPageIndex = () => this.swiper.scrollBy(-1, true);

  handleBackButton = () => {
    const { currentIndex } = this.state;
    const { navigation } = this.props;
    
    navigation.navigate('DrawerClose');

    if (currentIndex != 0){
      this.swiper.scrollBy(-1, true);
      return true;
    }

    if (this.state.uri){
      Alert.alert(
        'Caution', 
        'Are you sure to stop posting?', 
        [
          {text: 'Yes', onPress: () => navigation.goBack()},
          {text: 'No'}
        ]
      )

      return true;
    }

    return false;
  }

  initPhotoState = () => {

    if(this.state.uri){ 
      RNFS.unlink(this.state.uri)
      .then(() => console.log('Deletion Success!'))
      .catch(() => console.log('Given path is invalid!')) 
    }
    
    this.setState({width: null, height: null, uri: null, base64: null})
  };

  setPhotoState = (width, height, uri, base64) => {
    this.setState({width, height, uri, base64})
    setTimeout(() => this.incrementPageIndex(), 2000);
  };

  initPlace = () => this.setState({place: null});
  setPlace = (place) => this.setState({place});

  setDescription = (description) => this.setState({description});

  handleSubmit = () => {
    
    const { navigation, postUploadStart, postUploadEnd, insertPostObject } = this.props;
    const { uri, place, base64, width, height, description } = this.state;
    
    const previewParams = (width: number, height: number) => ({
      offset: { x: 0, y: 0 },
      size: { width, height },
      displaySize: {
        //Guarantee at least 200 X (200*width/height) quality
          width: 200,
          height: 200*height/width,
      },
      resizeMode: "contain"
    });

    const uploadPost = async () => { 
      const photo = new Parse.File('photo.jpg', {base64: this.state.base64}, "image/jpg");
      const preview = new Parse.File('preview.jpg', {base64: this.state.previewBase64}, "image/jpg")
      const user = await Parse.User.currentAsync();

      preview.save();
      photo.save()
      .then(() => {
        var post = new Parse.Object("Post");

        post.set("parent", user);
        post.set("photo", photo);
        post.set("preview", preview);
        post.set("description", description);
        post.set("place", place);

        navigation.navigate('GalleryScreen');

        post.save(null, {
          success: postObject => {
            console.log("Almost done: ", postObject);
            insertPostObject(postObject);      
            postUploadEnd();
            alert("Your post is uploaded successfully!")
          },
         
          error: error => {
            postUploadEnd();
            console.log(error);
            alert("Network error");
          }
        });
      })
    }

    if(!uri){
      ToastAndroid.show("You don't select your photo yet", ToastAndroid.SHORT);
      return ;
    } else {

      postUploadStart();

      ImageEditor.cropImage(
        this.state.uri,
        previewParams(width, height),
        previewURI => 
          RNFS.readFile(previewURI, 'base64')
          .then(previewBase64 => {
            this.setState({previewBase64});
            uploadPost();
          })
          .catch(error => {
            postUploadEnd();
            alert("Error... Please try again!")
            console.log(error)
          }),
        err => {alert("error: ", err); console.log("error: ", err), postUploadEnd()}
      )
    }
  }

  componentDidMount(){ BackHandler.addEventListener('hardwareBackPress', this.handleBackButton) }
  componentWillUnmount(){ BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton) }

  render(){
    return(
      <View style={styles.container}>
        <Swiper
          ref={ref => this.swiper = ref}
          style={{width:'100%', flex: 1}}
          loop={false}
          onIndexChanged={index => this.setState({currentIndex: index})}
          //scrollEnabled={this.state.uri ? true : false}
          showsPagination={false}
          showsButtons={this.state.uri ? true : false}>
          <PhotoScreen 
            initPhotoState={this.initPhotoState}
            setPhotoState={this.setPhotoState}
            uri={this.state.uri}
          />
          <InfoScreen 
            initPlace={this.initPlace}
            setPlace={this.setPlace}
            place={this.state.place}
            setDescription={this.setDescription}
            description={this.state.description}
            submit={this.handleSubmit}
          />
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
  },

  wrapper:{
    width:'100%',
    flex: 1,
    paddingTop:'2%',
    paddingBottom: '2%',
    paddingLeft:'2%',
    paddingRight:'2%',
  },

  navigator:{
    width:'100%',
    height:'6%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
  }
})

const mapStateToProps = (state) => {
  return {
    isUploading: state.PostUploadReducer.isUploading,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    postUploadStart: () => dispatch(actions.postUploadStart()),
    postUploadEnd: () => dispatch(actions.postUploadEnd()),
    insertPostObject: postObject => dispatch(actions.insertPostObject(postObject)),
  };
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(PostAddScreen));
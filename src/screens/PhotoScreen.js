import React from 'react'
import { 
  StyleSheet, 
  View, 
  TouchableOpacity,
  CameraRoll, 
  Image,
  Alert,
  ToastAndroid,
  ImageBackground
} from 'react-native';

import { FBText } from '../components';
import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/Ionicons';
import Parse from 'parse/react-native';
import ImagePicker from 'react-native-image-picker';

const MAX_FILESIZE = 1024 * 1024 * 10 // 10MB

const EmptyViewItem = ({iconName, type, description}) => {
  return (
    <View style={{width:'100%', flex: 1, flexDirection:'row'}}>
      <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
        <Icon name={iconName} size={30} color='gray' />
        {type && <FBText style={{color: 'gray'}}>{type}</FBText>}
      </View>
      <View style={{flex: 3, alignItems:'center', justifyContent:'center'}}>
        <FBText style={{fontSize: 12}}>{description}</FBText>
      </View>
    </View>
  );
}

class PhotoScreen extends React.Component {

  constructor(props){
    super(props);
  }

  handleCameraOption = () => {

    const { setPhotoState } = this.props;
  
    const options = {
      storageOptions:{
        cameraRoll: true
      }
    }
  
    ImagePicker.launchCamera(options, response => {
      if(response.didCancel){
        ToastAndroid.show('You have cancelled taking photo.', ToastAndroid.SHORT);
      } else if (response.error){
        alert(response.error)
      } else if (response.fileSize > MAX_FILESIZE){
        alert('You cannot upload picture over 10MB size');
      } else {
        const { width, height, uri, data } = response;
        setPhotoState(width, height, uri, data);
      }
    })

  };

  handleGalleryOption = () => {

    const { setPhotoState } = this.props;

    ImagePicker.launchImageLibrary({}, response => {
      if(response.didCancel){
        ToastAndroid.show('You have cancelled taking photo.', ToastAndroid.SHORT);
      } else if (response.error){
        alert(response.error)
      } else if (response.fileSize > MAX_FILESIZE){
        alert('You cannot upload picture over 10MB size');
      } else {
        const { width, height, uri, data } = response;
        setPhotoState(width, height, uri, data);
      }
    })
  };
  
  handleURLOption = () => {
    alert("We are preparing this option!")
  };

  handleTakeAgain = () => {
    Alert.alert(
      'Caution', 
      "Don't you like this photo?",
      [
        {text: 'Yes', onPress: () => this.props.initPhotoState()},
        {text: 'No'}
      ]
    )
  }

  render(){
    const emptyView = (
      <View style={styles.emptyView}>
        <TouchableOpacity style={styles.emptyViewItem} onPress={this.handleCameraOption}>
          <EmptyViewItem iconName='md-camera' description='Take your photo right now!' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emptyViewItem} onPress={this.handleGalleryOption}>
          <EmptyViewItem iconName='md-photos' description='Select your photo in the gallery!' />
        </TouchableOpacity>{
        <TouchableOpacity style={styles.emptyViewItem} onPress={this.handleURLOption}>
          <EmptyViewItem iconName='ios-attach' description='Copy remote URL here!' />
        </TouchableOpacity>}
      </View>
    );

    if(!this.props.uri){
      return (
          <View style={styles.container}>
            {emptyView}
          </View>
      );
    }

    else {
      return (
        <View style={styles.container}>
          <View style={styles.photoView}>
            <Image style={{width:'100%', flex: 1}} resizeMode='contain' source={{uri: this.props.uri}} />
          </View>
          <TouchableOpacity 
            style={styles.photoViewButton}
            onPress={this.handleTakeAgain}>
            <FBText style={{fontSize: 10, color:'white'}}>Take again</FBText>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },

  emptyView: {
    marginTop:'2%',
    marginBottom:'2%',
    marginLeft:'2%',
    marginRight:'2%',
  },

  emptyViewItem : {
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white'
  },

  photoView:{
    width:'100%',
    flex: 1,
    backgroundColor: 'black',
  },

  photoViewButton: {
    position: 'absolute', 
    width: '20%', 
    height: '5%', 
    top: '2%', 
    right: '2%', 
    alignItems:'center', 
    justifyContent:'center',
    backgroundColor:'transparent', 
    borderWidth: 0.5,
    borderColor:'white', 
    borderRadius:10,
  }
})

export default withNavigation(PhotoScreen);
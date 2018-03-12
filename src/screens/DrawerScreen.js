import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { withNavigation } from 'react-navigation';

import { FBText } from '../components';

import RNFS from 'react-native-fs';

/* Redux related modules */
import * as actions from '../actions';
import { connect } from 'react-redux';

class DrawerScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      containerWidth: 300,
      containerHeight: 100,
      drawerPhotoURI: null,
    }
  }

  componentDidMount(){
    // User drawerPhoto is saved in local FS
    const drawerPhotoURI = RNFS.DocumentDirectoryPath + '/drawerPhoto.jpg';
    RNFS.exists(drawerPhotoURI)
    .then(existed => {
      if(existed) {
        this.setState({drawerPhotoURI})
      }
    })
  }

  render(){
    const { navigation } = this.props;
    const { containerWidth, containerHeight, drawerPhotoURI } = this.state;
    return(
      <View style={styles.container} onLayout={(event) => {
        const {width, height} = event.nativeEvent.layout;
        this.setState({containerWidth: width, containerHeight: height});
      }}>
        <View style={styles.board}>
          <TouchableOpacity style={{width: '100%', height: containerHeight*0.3, backgroundColor:'white', alignItems:'center', justifyContent:'center'}}>
            {drawerPhotoURI ? <Image style={{width:'100%', height:'100%'}} resizeMode='contain' source={this.state.drawerPhotoURI} /> : <FBText>Choose Your Photo!</FBText>}
          </TouchableOpacity>
          <Image 
            source={require('../../assets/images/defaultAvatar.jpg')} 
            style={{
              position:'absolute',
              width:containerWidth*0.3, 
              height:containerWidth*0.3, 
              borderRadius: containerWidth*0.15,
              alignSelf:'center',
              top: containerHeight*0.3 - containerWidth*0.15}} 
            resizeMode='cover'/>
        </View>
        <View style={styles.pannel}>
          <TouchableOpacity style={[styles.pannelItem, {height: containerHeight*0.1}]} onPress={() => navigation.navigate('HomeScreen')}>
            <FBText>Home</FBText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pannelItem, {height: containerHeight*0.1}]} onPress={() => navigation.navigate('GalleryScreen')}>
            <FBText>Gallery</FBText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pannelItem, {height: containerHeight*0.1}]} onPress={() => navigation.navigate('PostAddScreen')}>
            <FBText>PostAdd</FBText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pannelItem, {height: containerHeight*0.1}]} onPress={() => navigation.navigate('SettingScreen')}>
            <FBText>SettingScreen</FBText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pannelItem, {height: containerHeight*0.1}]} onPress={() => navigation.navigate('TestScreen')}>
            <FBText>TestScreen</FBText>
          </TouchableOpacity>
        </View>
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
  },

  board:{
    width:'100%',
    flex: 1,
    backgroundColor:'rgb(226, 226, 226)',
  },

  profileImage: {
    
  },

  pannel:{
    width:'100%',
    flexDirection:'row',
    flexWrap: 'wrap'
  },
  
  pannelItem:{
    width:'100%',
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(DrawerScreen));
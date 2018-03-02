import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { withNavigation } from 'react-navigation';

import { FBText } from '../components';


class DrawerScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      containerWidth: 300,
      containerHeight: 100,
    }
  }

  render(){
    const { navigation } = this.props;
    const { containerHeight } = this.state;
    return(
      <View style={styles.container} onLayout={(event) => {
        const {width, height} = event.nativeEvent.layout;
        this.setState({containerWidth: width, containerHeight: height});
      }}>
        <View style={styles.board}>
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
    backgroundColor:'gray',
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

export default withNavigation(DrawerScreen);
import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native';

class LoadingScreen extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={{width:'30%', height: '30%'}} resizeMode='contain'/>
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

export default LoadingScreen;
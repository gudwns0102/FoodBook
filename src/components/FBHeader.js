import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { FBText } from '../components';

import { connect } from 'react-redux';


class FBHeader extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      date: new Date(),
      opacity: new Animated.Value(1),
      index: 0,
    }

    this.messages = [
      `Do you have your meal?`, // recommend menu ? 
      `How about a cup of coffee?`, // recommend when it is time after eating...? 
      `It's cold outside!` // get weather API
    ]
  }

  _blink = () => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration: 1000,
      }
    ).start(() => {
        this.setState({index: (this.state.index + 1) % this.messages.length})
        Animated.timing(
          this.state.opacity,
          {
            toValue: 1,
            duration: 1000,
          }
        ).start();
      }
    )
  }

  componentDidMount(){
    this.timer = setInterval(() => this.setState({date: new Date()}), 1000);
    this.blink = setInterval(() => this._blink(), 30000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
    clearInterval(this.blink);
  }

  render(){
    const { navigation } = this.props;
    const { date } = this.state;
    const dateString = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;

    const cameraButton = (
      <TouchableOpacity 
        style={styles.menuView} 
        onPress={()=>navigation.navigate('PostAddScreen')}>
        <Icon name='md-camera' size={25}/>
      </TouchableOpacity>
    )

    const uploadingState = (
      <View style={styles.menuView}>
        <ActivityIndicator />
      </View>
    )

    return(
      <View style={{width:'100%', flex: 1, flexDirection:'row', backgroundColor:'white', borderBottomWidth: 0.5, borderColor:'rgba(201, 201, 201, 0.849)'}}> 
        <TouchableOpacity style={styles.menuView} onPress={()=>navigation.navigate('DrawerToggle')}>
          <Icon name='md-menu' size={25} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <FBText>{dateString}</FBText>
        </View>
        {/*
        <Animated.View style={{flex: 1, alignItems:'center', justifyContent:'center', opacity: this.state.opacity}}>
          <FBText style={{fontSize: 10}}>{this.messages[this.state.index]}</FBText>
        </Animated.View>
        */}
        {this.props.isUploading ? uploadingState : cameraButton}
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

  menuView: {
    width:'12%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
  }
})

const mapStateToProps = (state) => {
  return {
    isUploading: state.PostUploadReducer.isUploading,
  };
}

export default connect(mapStateToProps, null)(FBHeader);
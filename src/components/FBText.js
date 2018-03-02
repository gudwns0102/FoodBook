import React from 'react'
import { StyleSheet, Text } from 'react-native';

class FBText extends React.Component {
  render(){
    return (
      <Text style={[styles.defaultTextStyle, this.props.style]}>{this.props.children}</Text>
    );
  }
}

const styles = StyleSheet.create({
  defaultTextStyle:{
    fontFamily: 'Comfortaa-Regular',
  }
})

export default FBText;
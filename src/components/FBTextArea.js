import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Animated, 
  TouchableOpacity } from 'react-native';

import { FBText } from './';

class FBTextArea extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      text: '',
    }

  }

  render(){
    return(
      <View style={this.props.style}>
        <TouchableOpacity style={styles.defaultHeader}>
          <FBText>{this.props.headerLabel}</FBText>
        </TouchableOpacity>
        <TextInput
          {...this.props}
          multiline={this.props.multiline}
          placeholder={this.props.placeholder}
          style={styles.defaultStyle}
          underlineColorAndroid={this.props.underlineColorAndroid}
          maxLength={200}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultHeader: {
    width:'100%',
    paddingLeft:'2%',
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(55, 167, 201, 0.884)',
    justifyContent:'center',
  },

  defaultStyle: {
    borderBottomLeftRadius: 10, 
    backgroundColor:'white',
    maxHeight: '85%'
  }
})

FBTextArea.defaultProps = {
  headerLabel: 'Header',
  multiline: true,
  placeholder: '',
  underlineColorAndroid: 'rgba(0,0,0,0)',
}

export default FBTextArea;
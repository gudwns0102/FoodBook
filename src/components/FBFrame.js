import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text 
} from 'react-native';

import PhotoView from 'react-native-photo-view';

class FBFrame extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <PhotoView 
        source={this.props.source}
        minimumZoomScale={this.props.minimumZoomScale}
        maximumZoomScale={this.props.maximumZoomScale}
        androidScaleType="fitCenter"
        style={this.props.style}
      />
    );
  }
}

FBFrame.defaultProps = {
  source: require('../../assets/images/logo.png'),
  minimumZoomScale: 1,
  maximumZoomScale: 3,
  style: {width:'100%', flex: 1, backgroundColor:'black'}
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

export default FBFrame;
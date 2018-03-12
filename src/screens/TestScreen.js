import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  PanResponder, 
  Animated, 
  Image,
  Share 
} from 'react-native';

import Parse from 'parse/react-native';

class TestScreen extends React.Component {

  constructor(props){
    super(props);

  }

  componentWillMount(){
    Parse.Cloud.run('test')
    .then(result => alert(result));
  }

  render(){
    return(
      <View style={styles.container}>
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

export default TestScreen;

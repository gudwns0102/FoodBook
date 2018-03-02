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

class TestScreen extends React.Component {

  constructor(props){
    super(props);

  }

  componentWillMount(){
    Share.share({message: 'hello world!'})
    .then(result => console.log(result));
  }

  render(){
    return(
      <View style={styles.container}>
        <Image style={{width:100, height: 100}} 
          source={{uri : "content://com.foodbook.provider/app_images/Android/data/com.foodbook/files/Pictures/image-2039d88b-c8a8-4990-a1d5-7b81195b00cf.jpg"}} />
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
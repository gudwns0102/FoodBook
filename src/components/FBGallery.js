import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text,
  FlatList, 
  TouchableOpacity
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { FBFrame } from './';


class FBGallery extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <View style={{width: '100%', flex: 1}}>
        <FlatList
          {...this.props}
        />
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome name='th' size={25} />
        </TouchableOpacity>
      </View>
    );
  }
}

FBGallery.defaultProps = {

}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
})

export default FBGallery;
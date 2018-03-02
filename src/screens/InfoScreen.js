import React from 'react'
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView } from 'react-native';

import { withNavigation } from 'react-navigation';

import { TextField } from 'react-native-material-textfield';
import { FBText, FBTextArea } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import RNGooglePlaces from 'react-native-google-places';

class InfoScreen extends React.Component {
  constructor(props){
    super(props);

  }

  openSearchModal = () => {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {
      console.log(place);
      this.props.setPlace(place);
      // place represents user's selection from the
      // suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  render(){

    const showLocation = (
      <View style={{width:'100%', backgroundColor:'white'}}>
        <View style={styles.locationItem}>
          <Ionicons name='md-restaurant' size={20} style={{width:'8%', paddingLeft:'2%'}}/>
          <FBText>  {this.props.place ? this.props.place.name || 'No name' : ''}</FBText>
        </View>
        <View style={styles.locationItem}>
          <Entypo name='location' size={20} style={{width:'8%', paddingLeft:'2%'}}/>
          <FBText>  {this.props.place ? this.props.place.address || 'No address' : ''}</FBText>
        </View>
        <View style={styles.locationItem}>
          <Ionicons name='ios-call' size={20} style={{width:'8%', paddingLeft:'2%'}}/>
          <FBText>  {this.props.place ? this.props.place.phoneNumber || 'No number': ''}</FBText>
        </View>
      </View>
    );

    const locationComponent = (
      <View>
        <View style={styles.locationHeader}>
          <FBText style={{paddingLeft: '2%'}}>Location</FBText>
        </View>
        {this.props.place && showLocation}
        <TouchableOpacity style={styles.locationButton} onPress={this.props.place ? this.props.initPlace : this.openSearchModal}>
          <Ionicons name={this.props.place ? 'md-trash' : 'ios-pin'} size={25} />
          <FBText> {this.props.place ? 'Remove Place' : 'Add Place'}</FBText>
        </TouchableOpacity>
      </View>
    );

    return(
      <TouchableWithoutFeedback style={{alignItems:'center', justifyContent:'center'}} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView style={{width:'100%', flex: 1}}>         
            <FBTextArea 
              style={{width:'100%', maxHeight:'30%', marginBottom: 20}}
              value={this.props.description}
              onChangeText={description => this.props.setDescription(description)}
              headerLabel='Description' 
              placeholder='Let me know about your meal!'
            />
            <View style={{width:'100%'}}>
              {locationComponent}
            </View>
            <View style={{flex: 1}}></View>
          </ScrollView>
          <TouchableOpacity 
            style={{width: '100%', height:50, backgroundColor: 'white', borderRadius: 5, alignItems:'center', justifyContent:'center'}}
            onPress={this.props.submit}>
            <FBText>Submit Post!</FBText>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    padding: '2%',
  },

  locationButton: {
    width:'100%',
    height: 50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    borderBottomLeftRadius: 10,
  },

  locationHeader: {
    width: '100%', 
    backgroundColor:'rgba(119, 202, 52, 0.884)', 
    borderTopRightRadius: 10
  },

  locationItem: {
    width:'100%', 
    paddingTop: 5, 
    paddingBottom: 5, 
    flexDirection:'row', 
    borderBottomWidth: 0.5, 
    borderBottomColor:'gray'
  }
  
})

export default withNavigation(InfoScreen);
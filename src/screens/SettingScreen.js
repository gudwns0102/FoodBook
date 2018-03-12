import React from 'react'
import { StyleSheet, View, Text, SectionList, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IconList = {
  Ionicons,
  MaterialCommunityIcons
}

const ItemSeparatorComponent = () => (
  <View style={{width:'100%', height: 1, alignItems:'center', backgroundColor:'rgba(201, 201, 201, 0.849)'}} />
);

const SectionHeader = ({section}) => {
  return (
    <View style={{width:'100%', height:50, flexDirection:'row', alignItems:'center'}}>
      <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
        <Ionicons name={section.sectionIcon} size={25}/>
      </View>
      <Text style={styles.sectionHeader}>{section.sectionName}</Text>
    </View>
  );
}

const SectionItem = ({item}) => {
  
  var Icon = IconList[item.itemIconType];

  return (
    <TouchableOpacity
      style={{width:'100%', height: 40, alignItems:'center', flexDirection:'row'}}
      onPress={item.onPress}>
      <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
        <Icon name={item.itemIconName} size={25}/>
      </View>
      <Text>{item.itemTitle}</Text>
    </TouchableOpacity>
  );
}

class SettingScreen extends React.Component {

  constructor(props){
    super(props);

    this.accountSection = {
      sectionName: 'Account',
      sectionIcon: 'md-person',
      data: [
        {
          itemTitle: 'Edit profile',
          itemIconType: 'MaterialCommunityIcons',
          itemIconName: 'account-edit',
          onPress: () => {},
        },
        {
          itemTitle: 'Logout',
          itemIconType: 'Ionicons',
          itemIconName: 'ios-log-out',
          onPress: this.props.parseLogout
        },
      ],
      ItemSeparatorComponent,
    }
  }

  render(){
    return(
      <SectionList
        style={{backgroundColor:'white'}}
        renderItem={SectionItem}
        renderSectionHeader={SectionHeader}
        sections={[
          this.accountSection,
        ]}
        ItemSeparatorComponent={() => <View style={{width: width*0.9, height: 2, backgronudColor:'red'}}/>}
        keyExtractor={({item, index}) => index}      
        SectionSeparatorComponent={ItemSeparatorComponent}
      />
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

  sectionHeader:{
    fontSize: 20, 
  }
})

export default SettingScreen;
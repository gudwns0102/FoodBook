import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Parse from 'parse/react-native';

import { withNavigation } from 'react-navigation';


class HomeScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      test: null,
    }
  }

  checkPost = async () => {
    const user = await Parse.User.currentAsync();
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.equalTo("parent", user);
    query.limit(30);
    query.descending("createdAt");
    

    query.find({
      success: results => {
        this.setState({test: results[0].get("photo")})
      },

      error: error => {
        alert("Error: " + error.code + " " + error.message);

      }
    })

  }

  componentDidMount(){
  }

  render(){
    const { parseLogout } = this.props;
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={parseLogout}>
          <Text>Log out</Text>
        </TouchableOpacity>
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

export default withNavigation(HomeScreen);



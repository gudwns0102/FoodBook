/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import Parse from 'parse/react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

/* Screens */
import * as Screens from './src/screens';
import * as Components from './src/components';

/* Redux related modules */
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as actions from './src/actions';
import reducers from './src/reducers';

import { LoginManager } from 'react-native-fbsdk';

const store = createStore(reducers);

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoadingUser: true,
      isLoadingPost: true,
      user: null,
    }

    this.PreLoginStack = StackNavigator(
      {
        LoginScreen: {screen: () => <Screens.LoginScreen fetchUser={this.fetchUser}/>},
        RegisterScreen: {screen: () => <Screens.RegisterScreen fetchUser={this.fetchUser}/>},
      },
      {
        navigationOptions: {
          headerStyle:{
            width: 0, height: 0
          }
        }
      }
    );

    this.DrawerStack = DrawerNavigator(
      {
        HomeScreen: {screen: () => <Screens.HomeScreen parseLogout={this.parseLogout}/>},
        GalleryScreen: {screen: () => <Screens.GalleryScreen />},
        PostAddScreen: {screen: () => <Screens.PostAddScreen />},
        SettingScreen: {screen: () => <Screens.SettingScreen parseLogout={this.parseLogout}/>},
        TestScreen: {screen: () => <Screens.TestScreen />}
      },
      {
        contentComponent: ({navigation}) => <Screens.DrawerScreen/>,
      }
    )

    this.PostLoginStack = StackNavigator(
      {
        DrawerStack: {screen: this.DrawerStack}
      },
      {
        navigationOptions: ({navigation}) => ({
          header: (
            <View style={{width:'100%', height:'8%', alignItems:'center', justifyContent:'center'}}>
              <Components.FBHeader navigation={navigation}/>
            </View>
          ),
        })
      }
    )
  }

  fetchUser = async () => {
    if(this.state.isLoadingUser){
      Parse.setAsyncStorage(AsyncStorage);

      Parse.initialize('QWDUKSHKDWOP@foodbook$HOFNDSESL#L');
      Parse.serverURL = 'http://13.125.101.187:1337/parse';

      Parse.User.enableUnsafeCurrentUser();
    }

    try {
      //If current user existed, isLoadingUser: false & isLoggedIn: true, 
      //If no current user, isLoadingUser: false & isLoggedIn: false
      const user = await Parse.User.currentAsync();
      this.setState({user: user ? user : null, isLoadingUser: false}, this.fetchPostList);
      //setTimeout(() => this.setState({}), 1000 - (end - start));
    } catch(e) {
      console.log(error);
      alert('Something Wrong. Please Try again!')
    }
  }

  fetchPostList = () => {
    const { user } = this.state;
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.equalTo("parent", user);
    query.limit(30);
    query.descending("createdAt");

    query.find({
      success: results => {
        console.log(results);
        store.dispatch(actions.fetchPostList(results));
        this.setState({isLoadingPost: false})
      },

      error: error => {
        alert("Error: " + error.code + " " + error.message);
        console.log(error);
        this.setState({isLoadingPost: false})
      }
    })
  }

  parseLogout = () => {
    LoginManager.logOut()
    Parse.User.logOut()
    .then(() => {
      this.setState({user: null})
    })
  }

  componentDidMount(){
    this.fetchUser();
  }

  render() {
    const { PreLoginStack, PostLoginStack } = this;
    const { isLoadingUser, user } = this.state;

    return (
      <Provider store={store}>
        {isLoadingUser ? <Screens.LoadingScreen /> : user ? <PostLoginStack /> : <PreLoginStack />}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

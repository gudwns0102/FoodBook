import React from 'react'
import { 
  StyleSheet, 
  View,
  Image,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity } from 'react-native';

import Parse from 'parse/react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

import { withNavigation } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';

import { FBText } from '../components';

class LoginScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false,
    }
  }

  handleLogin = () => {
    const { fetchUser, navigation } = this.props;
  
    this.setState({loading: true});

    Parse.User.logIn(this.state.username,this.state.password, {
      success: user => {
        this.setState({loading: false});
        fetchUser();
      },
      error: (user, error) => {
        this.setState({loading: false});
        alert(error);
      }
    })
  }

  handleRegister = () => {
    const { navigation } = this.props;
    navigation.navigate('RegisterScreen');
  }

  handleFacebookLogin = (data) => {
    const { fetchUser, navigation } = this.props;
    const { userID, accessToken, expirationTime } = data;
    var authData = {
      id: userID,
      access_token: accessToken,
      expiration_date: expirationTime
    };

    Parse.FacebookUtils.logIn(authData, {
      success: (user) => {
        console.log(user);
        fetchUser();
      },
      error : (user, error) => {
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(() => {
              this.onFacebookLogin(token);
            });
            break;

          default:
            // TODO: error
        }
      }
    })
  }

  render(){
    return(
      <ImageBackground
        source={require('../../assets/images/loginBackground.jpg')}
        style={styles.background}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{position: 'absolute', width: '100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
            <View style={styles.loginBox}>
              <Image style={{height:'20%', marginTop: '10%', marginBottom: '10%'}} resizeMode='contain' source={require('../../assets/images/logo.png')} />
              <View style={{width:'80%', flex: 1}}>
                <TextField
                  label='User ID'
                  value={this.state.username}
                  onChangeText={(username) => this.setState({ username })}
                />
                <TextField
                  label='Password'
                  value={this.state.password}
                  onChangeText={(password) => this.setState({ password })}
                  secureTextEntry={true}
                />
                <View style={{width: '100%', flex: 1, paddingTop: '10%', paddingBottom: '10%', alignItems:'center', justifyContent:'space-around'}}>
                  <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <FBText>Login</FBText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
                    <FBText>Register</FBText>
                  </TouchableOpacity>
                  <LoginButton
                    style={{width: '100%', height: 30, alignItems:'center', justifyContent:'center'}}
                    publishPermissions={["publish_actions"]}
                    onLoginFinished={
                      (error, result) => {
                        if (error) {
                          alert("login has error: " + result.error);
                        } else if (result.isCancelled) {
                          alert("login is cancelled.");
                        } else {
                          AccessToken.getCurrentAccessToken()
                          .then(this.handleFacebookLogin)
                        }
                      }
                    }
                    onLogoutFinished={() => alert("logout.")}/>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground >
    );
  }
}

const styles = StyleSheet.create({
  background:{
    flex: 1,
    width:'100%',
  },

  loginBox:{
    width:'90%',
    height:'90%',
    backgroundColor:'rgba(255, 255, 255, 0.9)',
    alignItems:'center',
  },

  button: { 
    width:'100%', 
    height: 30,
    alignItems:'center', 
    justifyContent:'center', 
    borderWidth: 1, 
    borderColor: 'gray', 
    borderRadius: 5,
    backgroundColor: 'transparent'
  }
})

export default withNavigation(LoginScreen);
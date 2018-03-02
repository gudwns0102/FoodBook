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

import { withNavigation } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';

import { FBText } from '../components';

class RegisterScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      retypePassword: '',
      loading: false,

      buttonText: 'Register',
      buttonColor: 'gray',
    }
  }

  handleRegister = () => {
    const { fetchUser, navigation } = this.props;
    const { username, password, retypePassword } = this.state;

    const ORIGIN_COLOR = 'gray';
    const CHECK_COLOR = 'rgba(119, 202, 52, 0.884)'
    const ERROR_COLOR = 'rgba(199, 54, 29, 0.884)';
    
    var user = new Parse.User();

    if (password.length < 8){
      this.setState({
        buttonText: 'Passwrod should be 8 or more!',
        buttonColor: ERROR_COLOR
      })

      setTimeout(() => this.setState({
        buttonText: 'Register',
        buttonColor: ORIGIN_COLOR
      }), 3000)

      return ;

    } else if (password != retypePassword){
      this.setState({
        buttonText: 'Retyped password is not proper!',
        buttonColor: ERROR_COLOR
      })

      setTimeout(() => this.setState({
        buttonText: 'Register',
        buttonColor: ORIGIN_COLOR
      }), 3000)

      return ;

    } else {
      this.setState({
        loading: true,
        buttonText: 'We are checking your account...',
        buttonColor: CHECK_COLOR
      });
    }

    user.set("username", username);
    user.set("password", password);

    user.signUp(null, {
      success: user => {
        this.setState({loading: false});
        fetchUser();
        navigation.navigate('HomeScreen');
      },

      error: (user, error) => {
        
        let message;

        if(error.code == 202){
          message = 'Account already exists for this username!'
        }

        this.setState({
          loading: false,
          buttonText: message,
          buttonColor: ERROR_COLOR
        })

        setTimeout(() => this.setState({
          buttonText: 'Register',
          buttonColor: ORIGIN_COLOR
        }), 3000)
      }
    })
  }

  render(){
    return(
      <ImageBackground
        source={require('../../assets/images/registerBackground.jpg')}
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
                <TextField
                  label='Retype Password'
                  value={this.state.retypePassword}
                  onChangeText={(retypePassword) => this.setState({ retypePassword })}
                  secureTextEntry={true}
                />
                <View style={{width: '100%', flex: 1, paddingTop: '10%', paddingBottom: '10%', alignItems:'center', justifyContent:'space-around'}}>
                  <TouchableOpacity 
                    style={[styles.button, {borderColor: this.state.buttonColor}]} 
                    onPress={this.handleRegister}
                    disabled={this.state.loading}
                  >
                    <FBText style={{color: this.state.buttonColor}}>{this.state.buttonText}</FBText>
                  </TouchableOpacity>
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
    height: 50,
    borderColor:'gray',
    alignItems:'center', 
    justifyContent:'center', 
    borderWidth: 1, 
    borderRadius: 5,
    backgroundColor: 'transparent'
  }
})

export default withNavigation(RegisterScreen);
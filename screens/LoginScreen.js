import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, Button ,StatusBar, ActivityIndicator } from 'react-native';
const base64 = require('base-64');


// create a component
class LoginScreen extends Component {
    static navigationOptions = {
      title: 'Login',
      header: null,
    };
    constructor(props) {
      super(props);
      this.state = {
        username: 'pensivej',
        password: '',
        isLoading: false,
        message: '',
      }
    };
    _onUsernameChanged = (event) => {
      this.setState({ username: event.nativeEvent.text });
    };
    _onPasswordChanged = (event) => {
      this.setState({ password: event.nativeEvent.text });
    };
    _checkValidInput(){
      if (this.state.username != '' && this.state.password != '')
        return true;
      else
        Alert.alert('Fill in all the blanks');
        return false;
    }
    _onButtonPress = () => {
      // this.props.navigation.navigate('SearchResult', {username: this.state.searchString});
      // Alert.alert('username: '+this.state.username+' password: ' + this.state.password);
      //
      // this.props.navigation.navigate('Main',{username:this.state.username});

      // if (_checkValidInput) this._userLoginTest();
      this.props.navigation.navigate('Main',{username:'pensivej', password: 'thisispassword'});
    };
    _userLoginTest = () => {
      var headers = new Headers();
      headers.append("Authorization", "Basic " + base64.encode(this.state.username+":"+this.state.password));
      proceed = false;
      fetch("https://api.github.com/user", {
          headers: headers
        })
        .then((response) => {
          console.log(response);
          if (response.status==200) proceed = true;
          else this.setState({ message: response.message });
        }).then(() => {
          this.setState({ isLoading: false })
          proceed =true;
          if (proceed) this.props.navigation.navigate('Main',{username:this.state.username});
          else Alert.alert('Wrong Password');
        })
        .done();
    }
    _userLogin = () =>{
      this.setState({isLoading: true, message: ''});

      var params = {
        username: this.state.username,
        password: this.state.password,
        grant_type: 'password',
      }

      var formBody = [];
        for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        var proceed = false;
        fetch("https:///api.github.com/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.status==200) proceed = true;
                else this.setState({ message: response.message });
            })
            .then(() => {
                this.setState({ isLoggingIn: false })
                if (proceed) this.props.onLoginPress();
            })
            .catch(err => {
				this.setState({ message: err.message });
				this.setState({ isLoggingIn: false })
			});
    }
    render() {
        return (
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
              <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={require('../Resources/cat.png')} />
                    <Image resizeMode="contain" style={styles.logoText} source={require('../Resources/GitHub_Logo_White.png')} />
                      {this.state.isLoading?
                        <View><Text></Text><ActivityIndicator size="large" color="#cfcfcf"/></View>
                        :null
                      }
              </View>

              {this.state.isLoading?null:
              <View style={styles.formContainer}>
                <View style={styles.textContainer}>
                    <StatusBar barStyle="light-content"/>
                    <TextInput style = {styles.input}
                                autoCapitalize="none"
                                onSubmitEditing={() => this.passwordInput.focus()}
                                onChange={this._onUsernameChanged}
                                autoCorrect={false}
                                keyboardType='email-address'
                                returnKeyType="next"
                                placeholder='Email or Username'
                                placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {styles.input}
                               onChange={this._onPasswordChanged}
                               returnKeyType="done" ref={(input)=> this.passwordInput = input}
                               placeholder='Password'
                               placeholderTextColor='rgba(225,225,225,0.7)'
                               secureTextEntry/>
                     {/*   <Button onPress={onButtonPress} title = 'Login' style={styles.loginButton} /> */}
                  <TouchableOpacity style={styles.buttonContainer} onPress={this._onButtonPress}>
                        <Text  style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
              </View>
              }
          </KeyboardAvoidingView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24292e',
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        width: 300,
        height: 100,
    },
    logoText: {
        width: 300,
        height: 100,
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    },
    textContainer: {
     padding: 20
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff'
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    loginButton:{
      backgroundColor:  '#2980b6',
       color: '#fff'
    }
});

//make this component available to the app
export default LoginScreen;

import React from 'react';
import { Alert, ScrollView, ActivityIndicator, StyleSheet, View, RefreshControl, TouchableHighlight} from 'react-native';
import { Button, List, ListItem, Header, Input, Avatar, Text, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser, Font } from 'expo';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      username: 'gaearon',
      refreshing: false,
      follow: false,
      star: false,
      user: '',
    }
    this.updateUsername = this.updateUsername.bind(this);
  }
  updateUsername(username){
    this.setState({
      username: username
    });
  }

  _onPressItem = (username) => {
   console.log('Pressed '+this.state.username)
    this.setState({
      users:'',
      username: username
    })
    this.getFollowerInfo(username);
    console.log('Pressed '+this.state.username)
    // this.props.navigation.navigate(
    //   'ProfileStack',
    //   { username: username }
    // );
  }

  _onPressFollow(){
    this.state.follow?
      this.setState({follow: false}):
      this.setState({follow: true})
  }

  _onRefresh() {
    console.log('refreshing');
    this.setState({refreshing: true});
    this.getFollowerInfo(this.state.username);
  }

  componentDidMount() {

    this.getFollowerInfo(this.state.username);
    Font.loadAsync({
      'Billabong': require('../assets/fonts/Billabong.ttf'),
    }).then(
      ()=>{
        this.setState({ fontLoaded: true })
      }
    );
  }

  getFollowerInfo(username) {
      console.log('Follower fetch');
      fetch(`https://api.github.com/users/` + username + '/following')
      .then(response => response.json())
      .then(
          users => {
              this.setState({
                  username: username,
                  users: users,
                  refreshing: false,
              });
          }
      );
  }
  getRepoInfo(username) {
      console.log('Repos fetch');
      fetch('https://api.github.com/users/'+username+'/repos')
      .then(response => response.json())
      .then(
          repos => {
              // How can we use `this` inside a callback without binding it??
              // Make sure you understand this fundamental difference with arrow functions!!!
              this.setState({
                  repos: repos
              });
          }
      );
  }
  getUserInfo(username) {
      fetch(`https://api.github.com/users/` + username)
      .then(response => response.json())
      .then(
          user => {
              this.setState({
                  username: user.login,
                  user: user
              });
          }
      );
  }


  render() {

    if (!this.state.users || !this.state.fontLoaded)
      return (<View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#24292e" />
      </View>)

    const follow = this.state.follow

    return (
      <View style={{backgroundColor:'white'}}>
        <Header backgroundColor='white'
          leftComponent={{ icon: 'mark-github', color: 'black', size: 28, type:'octicon'}}
          centerComponent={{ text: 'Followers' , style: { color: 'black', fontSize:18, marginBottom: 4, fontWeight:'400'} }}
          outerContainerStyles={{height: 65, borderBottomColor: '#888', borderBottomWidth:0.4, paddingBottom:5}}
          rightComponent={{ icon: 'home', color: 'black', size: 28 }}
        />

      <ScrollView style={{backgroundColor:'white'}}>
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
          />
        <List containerStyle={{marginBottom: 70, marginTop: 0, borderTopWidth: 0,}}>
            {
              this.state.users.map((l, i) => (
                <ListItem
                  containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
                  avatar={
                    <Avatar
                    rounded
                    medium
                    source={{uri: l.avatar_url}}
                    title={l.login}
                    />
                  }
                  onPress={()=>this._onPressItem(l.login)}
                  key={i}
                  title={l.login}
                  subtitle={l.login}
                  rightIcon={
                    <Button
                        title={follow?'Following':'Follow'}
                        buttonStyle={[styles.followButton, {backgroundColor:follow?'transparent':'#3099ec', borderWidth:follow?1:0}]}
                        onPress={this._onPressFollow.bind(this)}
                        textStyle={{color:follow?'black':'white', fontSize:14}}
                    />
                  }
                />
              ))
            }
          </List>

        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  followButton:{
    width: 110,
    height: 26,
    borderRadius: 5,
    marginRight: -15,
    borderColor: '#bbb',
  },
  follow: {
    backgroundColor: "#3099ec",
    borderColor: "transparent",
    borderWidth: 0,
  },
  unfollow: {
    backgroundColor: "grey",
    borderColor: "black",
    borderWidth: 0.2,
  },
  unfollowText:{
    color: "black",
  },
  repoContainer: {
    flexDirection:"row",
    marginBottom: 50,
    marginTop: -20,
  },
  leftContainer: {
    width: window.width/2,
    height: window.width/4,
    borderRightWidth: 1,
    borderRightColor: '#bbb',
  },
  rightContainer: {
    width: window.width/2,
    height: window.width/4,
    borderRightWidth: 1,
    borderRightColor: '#bbb',
  },
  titleContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  titleIconContainer: {
    paddingVertical: 10,
    flexDirection:'row',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'space-around',
    // alignItems:'center',
  },
  topButtonsContainer: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'space-around',
    marginLeft: 20,

    // alignItems:'center',
  },
  bottomButtonsContainer: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
  },
  followerText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4d4d4d',
  },
  followerSlugText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#a39f9f',
    backgroundColor: 'transparent',
  },
  nameText: {
    fontWeight: '600',
    color: 'black',
  },
  slugText: {
    color: '#a39f9f',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
})

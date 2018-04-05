import React from 'react';
import { Alert, ScrollView, ActivityIndicator, StyleSheet, View, RefreshControl, TouchableHighlight} from 'react-native';
import { Button, List, ListItem, Header, Input, Avatar, Text, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser, Font } from 'expo';
const base64 = require('base-64');

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  constructor(props){
    super(props);
    this.state = {
      username: this.props.navigation.state.params? this.props.navigation.state.params.username: 'gaearon',
      refreshing: false,
      follow: false,
      star: false,
      user: '',
      following: true,
      followingUsers: [],
    }
    this.updateUsername = this.updateUsername.bind(this);
    this.updateFollow = this.updateFollow.bind(this);
  }
  updateUsername(username){
    this.setState({
      username: username
    });
  }
  updateFollow(following){
    this.setState({
      following: following
    });
  }

  _onPressFollow(user, key){
    let username = user.login;
    var headers = new Headers();
    const params = this.props.navigation.state.params;
    console.log(params);
    headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
    console.log(username + ' added');
    fetch('https://api.github.com/user/following/'+username, {
        method: user.follow?'DELETE':'PUT',
        headers: headers
      });
    this._toggleFollow(key);
  }

  _toggleFollow(key){
    let usersCopy = Object.assign({}, this.state);
    usersCopy.users = usersCopy.users.slice();
    usersCopy.users[key] = Object.assign({}, usersCopy.users[key]);
    usersCopy.users[key].follow? usersCopy.users[key].follow = false :usersCopy.users[key].follow = true;
    this.setState(usersCopy);
  }

  _onPressItem = (username) => {
   console.log('Pressed '+this.state.username)
    // this.setState({
    //   users:'',
    //   username: username
    // })
    // this.getFollowerInfo(username);
    // console.log('Pressed '+this.state.username)
    const params = this.props.navigation.state.params;
    this.props.navigation.navigate(
      'Profile',
      { username: username, auth_user: params.auth_user, auth_pass: params.auth_pass  }
    );
  }

  _onRefresh() {
    console.log('refreshing');
    this.setState({refreshing: true});
    this.getFollowerInfo(this.state.username);
  }

  componentDidMount() {
    this.updateUsername(this.props.navigation.state.params.username)
    this.updateFollow(this.props.navigation.state.params.following)
    console.log(this.props.navigation.state);
    this.getFollowerInfo(this.state.username);
  }

  getFollowerInfo(username) {
      console.log('2Follower fetch');
      console.log(username);

      var headers = new Headers();
      const params = this.props.navigation.state.params
      headers.append("Authorization", "Basic " + base64.encode(this.props.navigation.state.params.auth_user+":"+this.props.navigation.state.params.auth_pass));
      const query = params.following? '/following': '/followers'
      fetch(`https://api.github.com/users/` + username + query, {
          headers: headers
        })
      .then(response => response.json())
      .then(
          users => {
              for (const u in users){
                this._isFollowing(users[u].login, u)
                users[u].follow = true
              }
              this.setState({
                  username: username,
                  users: users,
                  refreshing: false,
              });
          }
      );
  }

  _isFollowing(username, u){
    let result = false;
    var headers = new Headers();
    const params = this.props.navigation.state.params;
    headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
    const query = 'https://api.github.com/users/'+params.auth_user+'/following/'+username;
    fetch(query, {
      headers: headers
    }).then((response) => {
      console.log(response.status);
      if (response.status!=204) this._toggleFollow(u);
    })
  }

  render() {

    if (!this.state.users)
      return (<View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#24292e" />
      </View>)

    console.log('Render Follow');

    const follow = this.state.follow
    console.log(this.state.users);
    return (
      <View style={{backgroundColor:'white'}}>

      <ScrollView style={{backgroundColor:'white', height: window.height}}>
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
          />
        <List containerStyle={{marginBottom: 34, marginTop: 0, borderTopWidth: 0,}}>
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
                        title={l.follow?'Following':'Follow'}
                        buttonStyle={[styles.followButton, {backgroundColor:l.follow?'transparent':'#3099ec', borderWidth:l.follow?1:0}]}
                        onPress={()=>this._onPressFollow(l, i)}
                        textStyle={{color:l.follow?'black':'white', fontSize:14}}
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

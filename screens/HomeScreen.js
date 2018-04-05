import React from 'react';
import { Alert, ScrollView, ActivityIndicator, StyleSheet, View, RefreshControl, TouchableHighlight, StatusBar} from 'react-native';
import { Button, List, ListItem, Header, Input, Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser, Font } from 'expo';
const base64 = require('base-64');

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      username: 'pensivej',
      auth_user: 'pensivej',
      auth_pass: 'john4148',
      refreshing: false,
      follow: false,
      star: false,
      following: true,
      readyLoad: false,
      followingUsers: [],
    }
    this.updateUsername = this.updateUsername.bind(this);
  }
  updateUsername(username){
    this.setState({
      username: username
    });
  }

  _isFollowing(username){
    if (this.state.followingUsers.includes(username)) return true;
    else return false;
  }

  _onPressFollower = () => {
    this.props.navigation.push(
      'Follower',
      { username: this.state.username, auth_user: this.state.auth_user, auth_pass: this.state.auth_pass, following: false }
    );
  }

  _onPressFollowing = () => {
    this.props.navigation.push(
      'Follower',
      { username: this.state.username, auth_user: this.state.auth_user, auth_pass: this.state.auth_pass, following: true }
    );
  }

  _onPressSignOut(){
    this.props.navigation.goBack();
  }

  _onPressStar(){
    this.state.star?
      this.setState({star: false}):
      this.setState({star: true})
  }

  _onRefresh() {
    console.log('refreshing');
    this.setState({refreshing: true});
    const username = 'random';
    this.getRepoInfo(username)
    .then(this.getUserInfo(username))
  }

  _onPressRepo(url){
    WebBrowser.openBrowserAsync(url);
  }

  _onPressBlog(url){
    WebBrowser.openBrowserAsync(url);
  }

  componentDidMount() {
    if (this._isFollowing('gaearon')) console.log('worked!');
    console.log(this.props.navigation.state);
    const username = this.props.navigation.state.params? this.props.navigation.state.params.username: 'gaearon';
    console.log(username)
    this.getRepoInfo(username)
    .then(this.getUserInfo(username))
    .then(Font.loadAsync({
      'Billabong': require('../assets/fonts/Billabong.ttf'),
    }).then(
      ()=>{
        this.setState({ fontLoaded: true, readyLoad: true })
      }
    ));
  }

  getRepoInfo(username) {
      console.log('Repos fetch');

      var headers = new Headers();
      headers.append("Authorization", "Basic " + base64.encode(this.state.auth_user+":"+this.state.auth_pass));
      return fetch('https://api.github.com/user/repos', {
          headers: headers
        })
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
      var headers = new Headers();
      headers.append("Authorization", "Basic " + base64.encode(this.state.auth_user+":"+this.state.auth_pass));
      fetch(`https://api.github.com/user`, {
          headers: headers
        })
      .then(response => response.json())
      .then(
          user => {
              this.setState({
                  username: user.login,
                  user: user,
                  refreshing: false,
              });
          }
      );
  }


  render() {
    if (!this.state.user || !this.state.repos || !this.state.fontLoaded)
      return (<View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#24292e" />
      </View>)

    const follow = this.state.follow
    const star = this.state.star
    const repos = this.state.repos
    const user = this.state.user;

    const ListHeader =
        <View style={styles.titleContainer}>
          <View style={styles.titleIconContainer}>
            <Avatar
              large
              rounded
              source={{uri: user.avatar_url}}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
            <View style={styles.buttonsContainer}>
              <View style={styles.topButtonsContainer}>
                <TouchableHighlight
                  onPress={this._onPressRepos}
                  underlayColor='#dddddd'
                  >
                  <View style={styles.reposTextContainer}>
                    <Text style={styles.followerText} numberOfLines={1}>
                      {user.public_repos}
                    </Text>
                    <Text style={styles.followerSlugText} numberOfLines={1}>
                      Repos
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={this._onPressFollower}
                  underlayColor='#dddddd'
                  >
                  <View style={styles.followerTextContainer}>
                      <Text style={styles.followerText} numberOfLines={1}>
                          {user.followers}
                      </Text>
                      <Text style={styles.followerSlugText} numberOfLines={1}>
                        follower
                      </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={this._onPressFollowing}
                  underlayColor='#dddddd'
                  >
                  <View style={styles.followingTextContainer}>
                    <Text style={styles.followerText} numberOfLines={1}>
                        {user.following}
                    </Text>
                    <Text style={styles.followerSlugText} numberOfLines={1}>
                      following
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.bottomButtonsContainer}>
                <Button
                  title={'Sign Out'}
                  buttonStyle={{ width: 200, height: 30, borderRadius: 5, marginLeft: 20,
                  backgroundColor: follow?'transparent':'#dc3545', borderWidth: follow?1:0, borderColor:'#ccc', }}
                  onPress={this._onPressSignOut.bind(this)}
                  textStyle={{color:follow?'black':'white', fontSize: 14, fontWeight: '700', letterSpacing: 0.25}}
                />
                <Button
                  buttonStyle={{ width: 40, height: 30, borderRadius: 5, marginRight: 15, borderWidth:1, borderColor:'#ccc', backgroundColor: 'transparent', padding: 0}}
                  icon={{name: 'repo', color: 'black', type:'octicon', style:{padding:12}}}
                />
              </View>
            </View>
          </View>
          <View style={styles.titleTextContainer}>
            <View style={{flexDirection:'row', marginBottom: -10,}}>
              <Text style={[styles.nameText]} numberOfLines={1}>
                {user.name + '  '}
              </Text>
              <Text style={[styles.slugText]} numberOfLines={1}>
                @{user.login}
              </Text>
            </View>
            <Text style={styles.descriptionText}>
              {user.bio}
            </Text>
            {user.blog?<Text style={[styles.descriptionText, {color: 'blue'}]}
              onPress={()=>this._onPressBlog(user.blog)}>
              {user.blog}
            </Text>:null}
            {user.email?<Text style={styles.descriptionText}>
              {user.email}
            </Text>:null}
            {user.company?<Text style={styles.descriptionText}>
              Works {user.company}
            </Text>:null}
            <Text style={styles.descriptionText}>
              Created at {user.created_at}
            </Text>
          </View>

        </View>

    return (
      <View>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="black"
        />
        <Header backgroundColor='white'
          leftComponent={{ icon: 'mark-github', color: 'black', size: 28, type:'octicon'}}
          centerComponent={{ text: 'Github' , style: { color: 'black', fontSize:32, fontFamily: 'Billabong', marginBottom: -7} }}
          outerContainerStyles={{height: 64, borderBottomColor: '#888', borderBottomWidth:0.4, paddingBottom:5}}
          rightComponent={{ icon: 'home', color: 'black', size: 28 }}
        />

      <ScrollView style={{backgroundColor:'white', height: window.height}}>
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
          />
          {ListHeader}

          <Text style={{fontSize: 16, padding: 10, borderBottomColor: '#bbb', borderBottomWidth: 1}}>Repositories</Text>
            <View style={styles.repoContainer}>
              <List containerStyle={{marginBottom: 20,}}>
                {
                  this.state.repos.map((l, i) => (
                    <ListItem
                      roundAvatar
                      leftIcon={{name: 'repo', color: 'black', type:'octicon'}}
                      key={i}
                      title={l.name}
                      titleNumberOfLines={1}
                      containerStyle={styles.leftContainer}
                      subtitle={l.description}
                      subtitleNumberOfLines={2}
                      onPress={()=>this._onPressRepo(l.html_url)}
                      onPressRightIcon={this._onPressStar.bind(this)}
                      rightIcon={{name: 'star', type:'octicon', size: 5, color: (star?'gold':'gray')}}
                    />
                  ))
                }
              </List>
            </View>
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
    height: 30,
    borderRadius: 5,
    marginRight: -15,
  },
  follow: {
    backgroundColor: "#3099ec",
    borderColor: "transparent",
    borderWidth: 0,
  },
  signout: {
    backgroundColor: "#dc3545",
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
    marginBottom: 95,
    marginTop: -20,
  },
  leftContainer: {
    width: window.width,
    height: 75,
    borderRightWidth: 1,
    borderRightColor: '#bbb',
  },
  rightContainer: {
    width: window.width,
    height: 75,
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

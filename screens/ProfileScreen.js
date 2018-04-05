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
    // header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      username: this.props.navigation.state.params? this.props.navigation.state.params.username: 'gaearon',
      refreshing: false,
      follow: false,
      star: false,
      user: '',
      auth_user: '',
      auth_pass: '',
    }
    this.updateParams = this.updateParams.bind(this);
  }
  updateParams(params){
    this.setState({
      username: params.username,
      auth_user: params.auth_user,
      auth_pass: params.auth_pass,
    })
  }

  _isFollowing(username){
    let result = false;
    var headers = new Headers();
    const params = this.props.navigation.state.params;
    headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
    const query = 'https://api.github.com/users/'+params.auth_user+'/following/'+username;
    fetch(query, {
      headers: headers
    }).then((response) => {
      console.log(response.status);
      if (response.status==204) this.setState({follow: true});
    })
  }

  _isStarring(reponame){
    let result = false;
    var headers = new Headers();
    const params = this.props.navigation.state.params;
    headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
    const query = 'https://api.github.com/user/starred/'+params.auth_user+'/'+reponame;
    fetch(query, {
      headers: headers
    }).then((response) => {
      console.log(response.status);
      if (response.status==204) this.setState({follow: true});
    })
  }

  _onPressFollower = () => {

    const params = this.props.navigation.state.params;
    this.props.navigation.push(
      'Follower',
      { username: this.state.username, auth_user: params.auth_user, auth_pass: params.auth_pass, following: false }
    );
  }

  _onPressFollowing = () => {

    const params = this.props.navigation.state.params;
    this.props.navigation.push(
      'Follower',
      { username: this.state.username, auth_user: params.auth_user, auth_pass: params.auth_pass, following: true }
    );
  }

  _onPressFollow(){
    var headers = new Headers();
    const params = this.props.navigation.state.params;
    headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
    console.log(this.state.username);
    fetch('https://api.github.com/user/following/'+this.state.username, {
        method: this.state.follow? 'DELETE': 'PUT',
        headers: headers
      });
    this.state.follow?
      this.setState({follow: false}):
      this.setState({follow: true})
  }

  _onPressStar(){
    this.state.star?
      this.setState({star: false}):
      this.setState({star: true})
  }

  _onRefresh() {
    console.log('refreshing');
    this.setState({refreshing: true});
  }

  _onPressRepo(url){
    WebBrowser.openBrowserAsync(url);
  }

  _onPressBlog(url){
    WebBrowser.openBrowserAsync(url);
  }

  componentDidMount() {
    this.getRepoInfo(this.state.username)
    .then(this.getUserInfo(this.state.username))
  }

  getRepoInfo(username) {
      console.log('Repos fetch');
      var headers = new Headers();
      const params = this.props.navigation.state.params;
      headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
      return fetch('https://api.github.com/users/'+username+'/repos', {
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
      const params = this.props.navigation.state.params;
      const headers = new Headers();
      headers.append("Authorization", "Basic " + base64.encode(params.auth_user+":"+params.auth_pass));
      fetch(`https://api.github.com/users/` + username, {headers: headers})
      .then(response => response.json())
      .then(
          user => {

              this.setState({
                  username: user.login,
                  user: user
              });
          }
      ).then(
        this._isFollowing(this.state.username)
      );
  }


  render() {
    if (!this.state.user || !this.state.repos)
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
                  title={follow?'Following':'Follow'}
                  buttonStyle={{ width: 200, height: 30, borderRadius: 5, marginLeft: 20,
                  backgroundColor: follow?'transparent':'#3099ec', borderWidth: follow?1:0, borderColor:'#ccc', }}
                  onPress={this._onPressFollow.bind(this)}
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

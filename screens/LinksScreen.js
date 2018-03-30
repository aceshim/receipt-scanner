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
    this.updateUsername(username);
    this.componentDidMount()
    this.props.navigation.navigate(
      'Profile',
      { username: username }
    );
  }

  _onPressFollow(){
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
    this.getFollowerInfo(this.state.username);
  }

  _onPressRepo(url){
    WebBrowser.openBrowserAsync(url);
  }

  _onPressBlog(url){
    WebBrowser.openBrowserAsync(url);
  }

  componentDidMount() {

    this.getFollowerInfo(this.state.username);
    this.getRepoInfo(this.state.username);
    this.getUserInfo(this.state.username);
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

    if (!this.state.user || !this.state.users || !this.state.repos || !this.state.fontLoaded)
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
                  onPress={this._onPressFollower}
                  underlayColor='#dddddd'
                  >
                  <View style={styles.followerTextContainer}>
                      <Text style={styles.followerText} numberOfLines={1}>
                          {user.followers}
                      </Text>
                      <Text style={styles.followerSlugText} numberOfLines={1}>
                        Followers
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
                      Followings
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={this._onPressRepos}
                  underlayColor='#dddddd'
                  >
                  <View style={styles.reposTextContainer}>
                    <Text style={styles.followerText} numberOfLines={1}>
                      {user.public_repos}
                    </Text>
                    <Text style={styles.followerSlugText} numberOfLines={1}>
                      Repositories
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.bottomButtonsContainer}>
                <Button
                  title={'SIGN OUT'}
                  buttonStyle={{ width: 200, height: 30, borderRadius: 5, marginLeft: 20,
                  backgroundColor: follow?'transparent':'#dc3545', borderWidth: follow?1:0, borderColor:'#ccc'}}
                  onPress={this._onPressFollow.bind(this)}
                  textStyle={{color:follow?'black':'white'}}
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

    // const followersList =
    //   <List containerStyle={{marginBottom: 20, borderTopWidth: 0, borderBottomWidth: 0}}>
    //     {
    //       this.state.users.map((l, i) => (
    //         <ListItem
    //           containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
    //           avatar={<Avatar
    //             rounded
    //             medium
    //             source={{uri: l.avatar_url}}
    //             title={l.login}
    //           />}
    //           onPress={()=>Alert.alert(l.login)}
    //           key={i}
    //           title={l.login}
    //           subtitle={l.login}
    //           rightIcon={
    //             <Button
    //                 title={follow?'Following':'Follow'}
    //                 titleStyle={{ fontWeight: "700", color: "black" }}
    //                 buttonStyle={[styles.followButton, follow?styles.unfollow:styles.follow]}
    //                 onPress={this._onPressFollow.bind(this)}
    //                 textStyle={color:follow?'black':'white'}
    //             />
    //           }
    //           style
    //         />
    //       ))
    //     }
    //   </List>
    return (
      <View>
        <Header backgroundColor='white'
          leftComponent={{ icon: 'mark-github', color: 'black', size: 28, type:'octicon'}}
          centerComponent={{ text: 'Github' , style: { color: 'black', fontSize:32, fontFamily: 'Billabong', marginBottom: -7} }}
          outerContainerStyles={{height: 65, borderBottomColor: '#888', borderBottomWidth:0.4, paddingBottom:5}}
          rightComponent={{ icon: 'home', color: 'black', size: 28 }}
        />

      <ScrollView style={{backgroundColor:'white'}}>
          <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
          />
          {ListHeader}
          <Divider style={{ backgroundColor: '#ddd' }} />
          <Text style={{fontSize: 16, padding: 10}}>Repositories</Text>
          <View style={styles.repoContainer}>
            <List containerStyle={{marginBottom: 20,}}>
              {
                this.state.repos.map((l, i) => (
                  i%2 == 0?
                  <ListItem
                    roundAvatar
                    leftIcon={{name: 'repo', color: 'black', type:'octicon'}}
                    key={i}
                    title={l.name}
                    titleNumberOfLines={2}
                    containerStyle={styles.leftContainer}
                    subtitle={l.description}
                    subtitleNumberOfLines={3}
                    onPress={()=>this._onPressRepo(l.html_url)}
                    onPressRightIcon={this._onPressStar.bind(this)}
                    rightIcon={{name: 'star', type:'octicon', size: 5, color: (star?'gold':'gray')}}
                  />: null
                ))
              }
            </List>
            <List containerStyle={{marginBottom: 20}}>
              {
                this.state.repos.map((l, i) => (
                  i%2 == 1 ?
                    <ListItem
                      roundAvatar
                      leftIcon={{name: 'repo', color: 'black', type:'octicon'}}
                      key={i}
                      title={l.name}
                      titleNumberOfLines={2}
                      containerStyle={styles.rightContainer}
                      subtitle={l.description}
                      subtitleNumberOfLines={3}
                      onPress={()=>this._onPressRepo(l.html_url)}
                      onPressRightIcon={this._onPressStar.bind(this)}
                      rightIcon={{name: 'star', type:'octicon', size: 5, color: (star?'gold':'gray')}}
                    />:null
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

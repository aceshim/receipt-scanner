import React from 'react';
import { ActionSheetIOS, SectionList, Image, ImageBackground, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Constants, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Overlay } from 'react-native-elements';
import Touchable from 'react-native-platform-touchable';
import {
  StackNavigator,
} from 'react-navigation';
const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
const base64 = require('base-64');

import CameraButton from './CameraButton';

import data from '../data/data.json';

export default class Me extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      username: 'gaearon',
      fontLoaded: false,
      auth_user: '',
      auth_pass: '',
    }
    this.updateUsername = this.updateUsername.bind(this);
  }
  updateUsername(username){
    this.setState({
      username: username
    });
  }
  componentDidMount(){

    const username = this.props.navigation.state.params? this.props.navigation.state.params.username: 'gaearon';
    this.state.auth_user?this.getUserInfoWithAuth(this.state.username):this.getUserInfo(this.state.username);
    Font.loadAsync({
      'Ikaros': require('../assets/fonts/Ikaros-Regular.otf'),
    }).then(
    ()=>this.setState({ fontLoaded: true })
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

  getUserInfoWithAuth(username) {
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
    if (!this.state.user) {
      return null;
    }
    const user = this.state.user;

    const username = this.props.navigation.state.params;
    if (username != undefined){
      if (this.state.username != username.username){
        this.getUserInfo(username.username)
      }
    }

    const sections = [
      { data: [{ value: '$185.00' }], title: 'Walmart' },
      { data: [{ value: '$15.23' }], title: 'Country Market' },
      { data: [{ value: '$7.89' }], title: 'Amazon' },
      { data: [{ value: '$28.38' }], title: 'Amazon' },
      { data: [{ value: '$33.43' }], title: 'Bestbuy' },
      { data: [{ value: '$29.13' }], title: 'Meijer' },
      { data: [{ value: '$76.43' }], title: 'Am-Ko' },
    ];
    const ListFooter = () => {
      return (
        <TouchableOpacity style={styles.buttonContainer} onPress={this._onButtonPress}>
              <Text style={styles.buttonText}>SIGN OUT</Text>
        </TouchableOpacity>
      )
    }

    const ListHeader = () => {
      return (
        <View style={styles.titleContainer}>
          <View style={styles.titleIconContainer}>
            {this.state.fontLoaded?
              <ImageBackground style={styles.profileImage} source={{uri: user.avatar_url}}>
                <View style={styles.titleTextContainer}>
                  <Text style={[styles.nameText, {fontFamily: 'Ikaros'}]} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={[styles.slugText, {fontFamily: 'Ikaros'}]} numberOfLines={1}>
                    @{user.login}
                  </Text>
                </View>
              </ImageBackground>:null
            }
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight
              onPress={this._onPressFollower}
              underlayColor='#dddddd'
              >
              <View style={styles.followerTextContainer}>
                  <Text style={styles.followerSlugText} numberOfLines={1}>
                    Spending
                  </Text>
                  <Text style={styles.followerText} numberOfLines={1}>
                      <Ionicons style={styles.followIcon} name='logo-usd' size={16}/> {user.followers}
                  </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this._onPressFollowing}
              underlayColor='#dddddd'
              >
              <View style={styles.followingTextContainer}>
                <Text style={styles.followerSlugText} numberOfLines={1}>
                  Reciepts
                </Text>
                <Text style={styles.followerText} numberOfLines={1}>
                  <Ionicons style={styles.followIcon} name='ios-document' size={16}/> {user.following}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this._onPressRepos}
              underlayColor='#dddddd'
              >
              <View style={styles.reposTextContainer}>
                <Text style={styles.followerSlugText} numberOfLines={1}>
                  Folders
                </Text>
                <Text style={styles.followerText} numberOfLines={1}>
                  <Ionicons style={styles.followIcon} name="ios-folder" size={16}/> {user.public_repos}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      );
    };
    const cameraButton =
    <View style={styles.cameraButton}>
      <Icon
        raised
        reverse
        name='camera'
        type='font-awesome'
        color='#FF5252'
        onPress={() => this._cameraPressed()}
        />
    </View>

    const v =
      <SectionList
        style={styles.container}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        sections={sections}
      />
    return (
      <View style={styles.container}>
        {v}
        {cameraButton}
      </View>
    );
  }
  _cameraPressed(){
    // console.log('camera pressed');
    // this.props.navigation.navigate('Camera');
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Take Picture', 'Use Picture From Library'],
      // destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        console.log("Take Picture")
        this.props.navigation.navigate('Edit');
      } else if (buttonIndex === 2){
        console.log("Use Library")
        this.props.navigation.navigate('Edit');
      }
    });
  }

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };

  _renderItem = ({ item }) => {
    if (item.type === 'color') {
      return (
        <SectionContent>
          {item.value && <Color value={item.value} />}
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <Text style={styles.sectionContentText}>
            {item.value}
          </Text>
        </SectionContent>
      );
    }
  };


}



const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>
        {title}
      </Text>
    </View>
  );
};

const SectionContent = props => {
  return (
    <View style={styles.sectionContentContainer}>
      {props.children}
    </View>
  );
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl =
      '../Resources/dark_cat.png';
  }

  return (
    <Image
      source={{ uri: iconUrl }}
      style={{ width: 64, height: 64 }}
      resizeMode="cover"
    />
  );
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>
            {value}
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    // paddingHorizontal: 15,
    // paddingTop: 15,
    // paddingBottom: 15,
    // flexDirection: 'row',
  },
  titleTextContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sectionHeaderContainer: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14,
  },
  nameText: {
    fontWeight: '600',
    fontSize: window.height/20,
    paddingTop: window.height*0.5,
    paddingLeft: window.height/40,
    color: '#cccccc',
  },
  slugText: {
    color: '#a39f9f',
    fontSize: window.height/30,
    paddingLeft: window.height/40,
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
  followerTextContainer: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  followingTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  reposTextContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  followerText: {
    paddingTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4d4d4d',
  },
  followerSlugText: {
    fontSize: 14,
    color: '#a39f9f',
    backgroundColor: 'transparent',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  colorTextContainer: {
    flex: 1,
  },
  profileImage: {
    flex: 1,
    // height: window.height*2/3,
  },
  followIcon: {
    paddingTop: 30,
    marginTop: 30,
    flexDirection: 'row',
    top: 50,
  },
  buttonContainer:{
      width: window.width * 0.6,
      alignSelf: 'center',
      backgroundColor: '#b62029',
      paddingVertical: 15,
      marginTop: 30,
      marginBottom: 30,
  },
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  },
  cameraButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  }
});

import React from 'react';
import { Animated, Alert, ScrollView, ActivityIndicator, StyleSheet, View, RefreshControl, TouchableHighlight, StatusBar} from 'react-native';
import { Button, List, ListItem, Header, Input, Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser, Font } from 'expo';
const base64 = require('base-64');

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

import data from '../data/data.json';

import CameraButton from './CameraButton';
import Picker from './Picker';

export const category = {
  Default: {
    title: "Uncategorized",
    icon: {
      name: 'file',
      color: 'black',
      type:'octicon',
    }
  },
  Travel: {
    title: "Travel",
    icon: {
      name: 'plane',
      color: 'blue',
      type:'font-awesome',
    }
  },
  Entertainment: {
    title: "Entertainment",
    icon: {
      name: 'headphones',
      color: 'orange',
      type:'font-awesome',
    }
  },
  Grocery: {
    title: "Grocery",
    icon: {
      name: 'shopping-cart',
      color: 'green',
      type:'font-awesome',
    }
  },
  Dining: {
    title: "Dining",
    icon: {
      name: 'food',
      color: 'red',
      type:'material-community',
    }
  },
  Transport: {
    title: "Auto & Transport",
    icon: {
      name: 'car-side',
      color: 'purple',
      type:'material-community',
    }
  },
  Housing: {
    title: "Housing & Bills",
    icon: {
      name: 'home',
      color: 'navy',
      type:'material-community',
    }
  }
}


export default class App extends React.Component {
  static navigationOptions = {
    // header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      refreshing: false,
      category: "Default",
      selectedCategory: "Default",
      offSet: new Animated.Value(window.height),
      modal: true,
    }
    this._changeCategory = this._changeCategory.bind(this);
  }

  _onRefresh(){

  }

  _changeCategory(category){
    this.setState({
      selectedCategory: category,
    })
  }


  render() {

    const dataView =
    <View style={styles.repoContainer}>
      <List containerStyle={{marginBottom: 20,}}>
        {
          data.map((l, i) => (
            <ListItem
              roundAvatar
              leftIcon={l.category?category[l.category].icon:category["Default"].icon}
              key={i}
              title={l.company}
              titleNumberOfLines={1}
              containerStyle={styles.leftContainer}
              subtitle={l.balance + '\n'+l.registered}
              subtitleNumberOfLines={2}
              onPress={()=>this._onPressRepo(l.html_url)}
              onPressRightIcon={()=>this._onRefresh()}
            />
          ))
        }
      </List>
    </View>
    const header =

    <Header backgroundColor='white'
      leftComponent={{ icon: 'menu', color: 'black', size: 28, }}
      centerComponent={{ text: 'Reciept' , style: { color: 'black', fontSize:32, fontFamily: 'Billabong', marginBottom: -7} }}
      outerContainerStyles={{height: 64, borderBottomColor: '#888', borderBottomWidth:0.4, paddingBottom:5}}
      rightComponent={{ icon: 'home', color: 'black', size: 28 }}
    />

    return (
      <View style={styles.colorContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="black"
        />
        {header}
        <ScrollView style={{backgroundColor:'white', height: window.height}}>
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
            />

          <Text style={{fontSize: 28, padding: 10, paddingTop: 40, borderBottomColor: '#bbb', borderBottomWidth: 1}}>My Receipts</Text>

                 <TouchableHighlight style={styles.button} underlayColor="transparent" onPress={ () => this.setState({modal: true}) }>
                   <Text style={styles.buttonText}>CLICK TO SHOW PICKER</Text>
                 </TouchableHighlight>
                 <View style={styles.showtimeContainer}>
                  <Text style={styles.showtime}>Now viewing selectedCategory of {this.state.selectedCategory}</Text>
                  <Text style={styles.showtime}>Now viewing category of {this.state.category}</Text>
                 </View>
                 {this.state.modal?
                   <Picker
                   closeModal={() => this.setState({
                     modal: false,
                     category: this.state.selectedCategory
                   })}
                   offSet={this.state.offSet}
                   changeCategory = {this._changeCategory}
                   category={this.state.selectedCategory}
                   catList = {category}/>: null}
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
  showtimeContainer: {
   borderTopColor: '#ededed',
    borderTopWidth:1
  },
  showtime: {
   padding:20,
    textAlign: 'center'
  },
  button: {
    marginTop:25,
    marginBottom:25
  },
})

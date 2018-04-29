import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom, StackNavigator, HeaderBackButton } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ProfileScreen from '../screens/ProfileScreen';
import FollowScreen from '../screens/FollowScreen';
import CameraScreen from '../screens/CameraScreen';

export const ProfileStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params? navigation.state.params.username:'gaearon'}`,
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    headerRight: <Icon name='home' color='black' iconStyle={{fontSize: 28, marginRight: 10}} onPress={() => navigation.popToTop()}/> ,
      headerStyle: { backgroundColor : 'white' }
    }),
  },
  Follower: {
    screen: FollowScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.following? 'following':'follower'}`,
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      headerRight: <HeaderBackButton onPress={() => navigation.popToTop()} />,
      headerRight: <Icon name='home' color='black' iconStyle={{fontSize: 28, marginRight: 10}} onPress={() => navigation.popToTop()}/> ,
      headerStyle: { backgroundColor : 'white' }
    }),
  },
});

export const PageStack = StackNavigator({
  Home: {
    screen: FollowScreen,
  },
  Camera: {
    screen: CameraScreen,
  }
})

export default TabNavigator(
  {
    // Home: {
    //   screen: FollowScreen,
    // },
    Person: {
      screen: HomeScreen,
    },
    Camera: {
      screen: CameraScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        let iconType = 'font-awesome';
        let iconSize = 24;
        let iconMarginBottom = -3;
        let iconColor = 'black';
        iconColor = focused? 'black': '#bbb';
        switch (routeName) {
          case 'Home':
            iconName = 'home';
            iconSize = 28;
            break;
          case 'Camera':
            iconName = 'camera';
            iconSize = 26;
            iconColor = focused? 'black': '#bbb';
            break;
          case 'Settings':
            iconName = focused? 'heart': 'heart-o';
            break;
          case 'Person':
            iconName = 'file';
            iconType = 'octicon';
            iconSize = 26;
            iconColor = focused? 'black': '#bbb';
        }
        return (
          <Icon
            name={iconName}
            size={iconSize}
            style={{ marginBottom: -3}}
            color={iconColor}
            type={iconType}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: '#ddd',
      inactiveTintColor: '#bbb',
      showLabel: false,
      style: {
        backgroundColor: 'white',
      },
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

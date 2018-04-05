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

export default TabNavigator(
  {
    Home: {
      screen: ProfileStack,
    },
    Links: {
      screen: SettingsScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Person: {
      screen: ProfileScreen,
    }
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
          case 'Links':
            iconName = 'search';
            iconType = 'material';
            iconSize = 32;
            iconColor = focused? 'black': '#bbb';
            break;
          case 'Settings':
            iconName = focused? 'heart': 'heart-o';
            break;
          case 'Person':
            iconName = focused? 'user': 'user-o';
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

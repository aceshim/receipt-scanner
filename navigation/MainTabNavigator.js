import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom, StackNavigator, HeaderBackButton } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import AnalyzeScreen from '../screens/AnalyzeScreen';

import CameraScreen from '../screens/CameraScreen';
import EditReceipt from '../screens/EditScreen';
import ReceiptList from '../screens/ListScreen';

// export const PageStack = StackNavigator({
//   Home: {
//     screen: FollowScreen,
//   },
//   Camera: {
//     screen: EditReceipt,
//   },
//   Add: {
//     screen: EditReceipt,
//   }
// })

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    List: {
      screen: ReceiptList,
    },
    Add: {
      screen: EditReceipt,
    },
    Analyze: {
      screen: AnalyzeScreen,
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
        let iconStyle = {};
        iconColor = focused? 'black': '#bbb';
        switch (routeName) {
          case 'Home':
            iconName = 'home';
            iconSize = 28;
            break;
          case 'Add':
            iconName = 'camera';
            iconSize = 26;
            iconColor = focused? 'black': '#bbb';
            break;
          case 'Analyze':
            iconName = focused? 'bar-chart': 'bar-chart-o';
            break;
          case 'List':
            iconName = 'file';
            iconType = 'octicon';
            iconSize = 26;
            iconColor = focused? 'black': '#bbb';
            iconStyle = {paddingLeft: 6}
        }
        return (
          <Icon
            name={iconName}
            size={iconSize}
            containerStyle={iconStyle}
            color={iconColor}
            type={iconType}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: '#bbb',
      showLabel: true,
      style: {
        backgroundColor: 'white',
      },
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
  }
);

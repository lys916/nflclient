import React from 'react';
import { Platform, Icon } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PicksScreen from '../screens/PicksScreen';
import StandingsScreen from '../screens/StandingsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Games',
  tabBarOptions: {
    labelStyle: { fontSize: 15, paddingBottom: 3 },
    style: {
      height: 55
    }
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      iconType={'ionicons'}
      name={
        Platform.OS === 'ios'
          ? `md-american-football${focused ? '' : '-outline'}`
          : 'md-american-football'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: PicksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Picks',
  tabBarOptions: {
    labelStyle: { fontSize: 15, paddingBottom: 3 },
    style: {
      height: 55
    }
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      iconType={'materialcommunityicons'}
      focused={focused}
      name={Platform.OS === 'ios' ? 'fotoball-helmet' : 'football-helmet'}
    />
  ),
};

const StandingsStack = createStackNavigator({
  Links: StandingsScreen,
});

StandingsStack.navigationOptions = {
  tabBarLabel: 'Standings',
  tabBarOptions: {
    labelStyle: { fontSize: 15, paddingBottom: 3 },
    style: {
      height: 55
    }
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      iconType={'ionicons'}
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-trophy' : 'md-trophy'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarOptions: {
    labelStyle: { fontSize: 15, paddingBottom: 3 },
    style: {
      height: 55
    }
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      iconType={'ionicons'}
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  StandingsStack,
  SettingsStack,
});

import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import JoinLeagueScreen from '../screens/JoinLeagueScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import MainTabNavigator from './MainTabNavigator';

const LoginStack = createStackNavigator({ Login: LoginScreen });
const SignupStack = createStackNavigator({ Signup: SignupScreen });
const JoinLeagueStack = createStackNavigator({ JoinLeague: JoinLeagueScreen });
const CreateLeagueStack = createStackNavigator({ CreateLeague: CreateLeagueScreen });

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  AuthLoading: AuthLoadingScreen,
  Main: MainTabNavigator,
  Login: LoginStack,
  Signup: SignupStack,
  JoinLeague: JoinLeagueStack,
  CreateLeague: CreateLeagueStack
},
  {
    initialRouteName: 'AuthLoading',
  }
));
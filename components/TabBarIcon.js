import React from 'react';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

console.log('xzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', Colors);

export default class TabBarIonicon extends React.Component {
  render() {
    if (this.props.iconType === 'ionicons') {
      return (
        <Icon.Ionicons
          name={this.props.name}
          size={30}
          style={{ marginBottom: 3, marginTop: 10 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      );
    }
    if (this.props.iconType === 'materialcommunityicons') {
      return (
        <Icon.MaterialCommunityIcons
          name={this.props.name}
          size={30}
          style={{ marginBottom: 3, marginTop: 10 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      );
    }



  }
}
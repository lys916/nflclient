import React from 'react';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

// console.log('xzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', Colors);

export default class TabBarIonicon extends React.Component {
  render() {
    if (this.props.iconType === 'ionicons') {
      return (
        <Icon.Ionicons
          name={this.props.name}
          size={30}
          style={{ paddingTop: 10 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.inactive}
        />
      );
    }
    if (this.props.iconType === 'materialcommunityicons') {
      return (
        <Icon.MaterialCommunityIcons
          name={this.props.name}
          size={30}
          style={{ paddingTop: 10 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.inactive}
        />
      );
    }



  }
}
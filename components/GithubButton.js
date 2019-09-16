import React, { PureComponent } from 'react';
import { FontAwesome as Icon } from '@expo/vector-icons';

export default class GithubButton extends PureComponent {
  render() {
    const { onPress } = this.props;
    return (
      <Icon.Button name="github" color="black" backgroundColor="#ffffff" onPress={onPress}>
        Sign In with Github
      </Icon.Button>
    );
  }
}

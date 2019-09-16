import React, { Component } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import GithubButton from './components/GithubButton';
import {
  signInAsync,
  signOutAsync,
  initializeFirebase,
  attemptToRestoreAuthAsync
} from './helpers/firebaseSetup';

export default class App extends Component {
  state = {
    isSignedIn: false
  };

  componentDidMount() {
    this.setupFirebaseAsync();
  }

  setupFirebaseAsync = async () => {
    initializeFirebase();
    firebase.auth().onAuthStateChanged(async auth => {
      const isSignedIn = !!auth;
      this.setState({ isSignedIn });
      if (!isSignedIn) attemptToRestoreAuthAsync();
    });
  };

  render() {
    if (this.state.isSignedIn) {
      const user = firebase.auth().currentUser || {};
      return (
        <View style={styles.container}>
          <Text style={styles.logout} onPress={signOutAsync}>
            Logout
          </Text>
          <Image source={{ uri: user.photoURL }} style={styles.image} />
        </View>
      );
    }
    return (
      <View style={styles.button}>
        <GithubButton onPress={() => signInAsync()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  container: {
    paddingTop: 50,
    paddingRight: 20,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#000000'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  logout: {
    margin: 24,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  }
});

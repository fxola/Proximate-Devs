import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import {
  FIREBASE_API_KEY,
  FIREBASE_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  GITHUB_STORAGE_KEY
} from 'react-native-dotenv';
import getGithubToken from './getGithubToken';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID
};

export function initializeFirebase() {
  // Prevent reinitializing the app
  if (!firebase.apps.length) return firebase.initializeApp(firebaseConfig);
}

export async function signInAsync(token) {
  try {
    if (!token) {
      const gitHubToken = await getGithubToken();
      await AsyncStorage.setItem(GITHUB_STORAGE_KEY, gitHubToken);
      return signInAsync(gitHubToken);
    }
    const credential = firebase.auth.GithubAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential);
  } catch ({ message }) {
    return alert(message);
  }
}

export async function signOutAsync() {
  try {
    await AsyncStorage.removeItem(GITHUB_STORAGE_KEY);
    await firebase.auth().signOut();
  } catch ({ message }) {
    alert(`Error: ${message}`);
  }
}

export async function attemptToRestoreAuthAsync() {
  const token = await AsyncStorage.getItem(GITHUB_STORAGE_KEY);
  if (token) return signInAsync(token);
}

/* eslint-disable camelcase */
import { AuthSession } from 'expo';
import { GITHUB_CLIENT_ID, GITHUB_SECRET } from 'react-native-dotenv';

const REDIRECT_URL = AuthSession.getRedirectUrl();

const github = {
  id: GITHUB_CLIENT_ID,
  secret: GITHUB_SECRET
};

const githubFields = [
  'user',
  'public_repo',
  'repo',
  'repo_deployment',
  'repo:status',
  'read:repo_hook',
  'read:org',
  'read:public_key',
  'read:gpg_key'
];

function authUrlWithId(id, fields) {
  return (
    `https://github.com/login/oauth/authorize` +
    `?client_id=${id}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
    `&scope=${encodeURIComponent(fields.join(' '))}`
  );
}

async function createTokenWithCode(code) {
  const url =
    `https://github.com/login/oauth/access_token` +
    `?client_id=${github.id}` +
    `&client_secret=${github.secret}` +
    `&code=${code}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}

async function getGithubTokenAsync() {
  try {
    const { type, params } = await AuthSession.startAsync({
      authUrl: authUrlWithId(github.id, githubFields)
    });
    if (type !== 'success') return null;

    if (params.error) {
      const { error, error_description } = params;
      throw new Error(`Github Auth: ${error} ${error_description}`);
    }

    const { access_token } = await createTokenWithCode(params.code);
    return access_token;
  } catch ({ message }) {
    throw new Error(`Github Auth: ${message}`);
  }
}

export default getGithubTokenAsync;

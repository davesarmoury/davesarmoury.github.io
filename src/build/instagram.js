const fetch = require('node-fetch');
const {getParamsToString} = require('./url.js');

const baseUrl = 'https://graph.facebook.com';

const getInstagramAccessToken = async (env) => {
  const getParams = getParamsToString([
    [ 'client_id', env.INSTAGRAM_CLIENT_ID ],
    [ 'client_secret', env.INSTAGRAM_CLIENT_SECRET ],
    [ 'grant_type', 'client_credentials' ],
  ]);
  const response = await fetch(`${baseUrl}/oauth/access_token?${getParams}`);
  const {access_token} = await response.json();
  return access_token;
};

const getInstagramPost = async (url, accessToken) => {
  const getParams =
      [
        [ 'url', encodeURIComponent(url) ],
        [ 'hide_thread', true ],
        [ 'omit_script', true ],
        [ 'access_token', accessToken ],
      ].map((pair) => pair.join('='))
          .join('&');

  const response = await fetch(`${baseUrl}/v9.0/instagram_oembed?${getParams}`);
  const data = await response.json();

  return `<div class="row-span-2">${data.html}</div>`
};

module.exports = {
  getInstagramAccessToken,
  getInstagramPost,
};

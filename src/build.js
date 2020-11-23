const path = require('path');
const fs = require('fs/promises');
const pug = require('pug');
const jsYaml = require('js-yaml');
const fetch = require('node-fetch');

require('dotenv').config();
const {env} = process;

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'src', 'page');
const publicPath = path.join(root, 'public');
const cache = path.join(root, 'cache');

const loadData = async () => {
  const rawYaml =
      await fs.readFile(path.join(root, 'src', 'data.yaml'), 'utf-8');
  return jsYaml.safeLoad(rawYaml);
};

const withCache = (fn) => {
  const cache = {};

  return (...params) => {
    const key = params.join('|');
    if (cache[key]) {
      return cache[key];
    }

    cache[key] = fn(...params);
    return cache[key];
  };
};

const getTweet = withCache(
    async (tweetUrl) => {
      const getParams =
          [
            [ 'url', encodeURIComponent(tweetUrl) ],
            [ 'hide_thread', true ],
            [ 'omit_script', true ],
          ].map((pair) => pair.join('='))
              .join('&');

      const tweetResponse =
          await fetch(`https://publish.twitter.com/oembed?${getParams}`);
      const tweet = await tweetResponse.json();

      return `<div class="row-span-2">${tweet.html}</div>`
    },
);

const getInstagramAccessToken = async () => {
  const getParams =
      [
        [ 'client_id', env.INSTAGRAM_CLIENT_ID ],
        [ 'client_secret', env.INSTAGRAM_CLIENT_SECRET ],
        [ 'grant_type', 'client_credentials' ],
      ].map((pair) => pair.join('='))
          .join('&');
  const response =
      await fetch(`https://graph.facebook.com/oauth/access_token?${getParams}`);
  const {access_token} = await response.json();
  return access_token;
};

const getGram = withCache(
    async (url, accessToken) => {
      const getParams =
          [
            [ 'url', encodeURIComponent(url) ],
            [ 'hide_thread', true ],
            [ 'omit_script', true ],
            [ 'access_token', accessToken ],
          ].map((pair) => pair.join('='))
              .join('&');

      const response = await fetch(
          `https://graph.facebook.com/v9.0/instagram_oembed?${getParams}`);
      const data = await response.json();
      console.log('instagram', data);

      return `<div class="row-span-2">${data.html}</div>`
    },
);

const output = (data) => {
  return new Promise((resolve, reject) => {
    pug.renderFile(
        path.join(pagePath, 'index.pug'),
        data,
        (err, html) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(
              fs.writeFile(path.join(publicPath, 'index.html'), html, 'utf-8'),
          );
          return;
        },
    );
  });
};

const transformUrl =
    (url, instagramAccessToken) => {
      if (url.startsWith('https://twitter.com')) {
        return getTweet(url);
      }
      if (url.startsWith('https://www.instagram.com')) {
        return getGram(url, instagramAccessToken);
      }
      return `<img src="${url}" alt="" />`;
    }

const transformMediaCollection = (media, instagramAccessToken) =>
    media.reduce(async (transformed, url) => {
      const html = await transformUrl(url, instagramAccessToken);
      return [
        ...(await transformed),
        html,
      ];
    }, []);

loadData()
    .then(async (data) => {
      const instagramAccessToken = await getInstagramAccessToken();

      return output({
        ...data,
        robots : {
          susan : {
            ...data.robots.susan,
            media : (await transformMediaCollection(data.robots.susan.media,
                                                    instagramAccessToken))
          },
          herman : {
            ...data.robots.herman,
            media : (await transformMediaCollection(data.robots.herman.media,
                                                    instagramAccessToken))
          }
        },
      });
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

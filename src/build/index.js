const path = require('path');
const fs = require('fs/promises');
const jsYaml = require('js-yaml');
const {getTweet} = require('./twitter.js');
const {getInstagramAccessToken, getInstagramPost} = require('./instagram.js');
const {getYoutubeCache, getYoutubeVideo, getYoutubePlaylist} =
    require('./youtube.js');
const {output} = require('./output.js');
require('dotenv').config();

const root = path.resolve(__dirname, '..', '..');
const pagePath = path.join(root, 'src', 'page');
const publicPath = path.join(root, 'public');

const {env} = process;

const loadData = async () => {
  const dataFile = path.join(root, 'src', 'data.yaml');
  const rawYaml = await fs.readFile(dataFile, 'utf-8');
  return jsYaml.safeLoad(rawYaml);
};

const transformUrl =
    (url, instagramAccessToken) => {
      if (url.startsWith('https://twitter.com')) {
        return getTweet(url);
      }
      if (url.startsWith('https://www.instagram.com')) {
        return getInstagramPost(url, instagramAccessToken);
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

const main = async () => {
  const data = await loadData();

  const instagramAccessToken = await getInstagramAccessToken(env);
  const youtubeCache = await getYoutubeCache(data, env.GOOGLE_PLATFORM_API_KEY);

  const susanMedia = await transformMediaCollection(
      data.robots.susan.media,
      instagramAccessToken,
  );
  const hermanMedia = await transformMediaCollection(
      data.robots.herman.media,
      instagramAccessToken,
  );
  const pugData = {
    ...data,
    robots : {
      susan : {...data.robots.susan, media : susanMedia},
      herman : {...data.robots.herman, media : hermanMedia}
    },
  };

  const inputPug = path.join(pagePath, 'index.pug');
  const outputHtml = path.join(publicPath, 'index.html');
  return output(inputPug, pugData, outputHtml);
};

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

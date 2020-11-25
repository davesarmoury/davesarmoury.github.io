const fetch = require('node-fetch');
const {getParamsToString} = require('./url.js');

const baseUrl = 'https://publish.twitter.com';

const defaultGetParams = [
  [ 'hide_thread', true ],
  [ 'omit_script', true ],
];

const getTweetOEmbedUrl = (tweetUrl) => {
  const getParams = getParamsToString([
    ...defaultGetParams,
    [ 'url', encodeURIComponent(tweetUrl) ],
  ]);

  return `${baseUrl}/oembed?${getParams}`;
};

const wrapContent = (html) => {
  return `
    <div class="row-span-2" style="margin-top: -10px; margin-bottom: -10px">
      ${html}
    </div>
  `;
};

const getTweet = async (tweetUrl) => {
  const tweetResponse = await fetch(getTweetOEmbedUrl(tweetUrl));
  const tweet = await tweetResponse.json();

  return wrapContent(tweet.html);
};

module.exports = {getTweet};

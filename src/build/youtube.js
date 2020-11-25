const fetch = require('node-fetch');
const {getParamsToString} = require('./url.js');
const baseUrl = 'https://www.googleapis.com/youtube/v3';

const youtubeApi = async (path, getParams, apiKey) => {
  const params = getParamsToString([...getParams, [ 'key', apiKey ] ])
  const response = await fetch(`${baseUrl}/${path}?${params}`);
  const json = await response.json();
  return json.items;
};

const getYoutubeVideos = async (ids, apiKey) =>
    youtubeApi('videos',
               [
                 [ 'part', 'contentDetails,fileDetails,id,snippet' ],
                 [ 'id', ids.join(',') ],
               ],
               apiKey);

const getYoutubePlaylists = async (ids, apiKey) =>
    youtubeApi('playlists',
               [
                 [ 'part', '' ],
                 [ 'id', ids.join(',') ],
               ],
               apiKey);

const getYoutubeCache = async (dataset, apiKey) => {
  const videoIds = [
    dataset.youtubeChannelId,
    dataset.heroYoutubeId,
    ...dataset.latestVideoIds,
    ...dataset.robots.susan.videoIds,
    ...dataset.robots.herman.videoIds,
  ];
  const playlistIds = [
    dataset.playlistIds,
    ...dataset.robots.susan.playlistId,
    ...dataset.robots.herman.playlistId,
  ];
  return {
    videos : await getYoutubeVideos(videoIds, apiKey),
    playlists : await getYoutubePlaylists(playlistIds, apiKey),
  };
};

const getYoutubeVideo = (videoId, youtubeCache) =>
    youtubeCache.videos.find((v) => v.id == videoId);

const getYoutubePlaylist = (playlistId, youtubeCache) =>
    youtubeCache.playlists.find((p) => p.id == playlistId);

module.exports = {
  getYoutubeCache,
  getYoutubeVideo,
  getYoutubePlaylist,
};

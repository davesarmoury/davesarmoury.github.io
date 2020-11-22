const item = (type, content, attrs = {}) => ({
  type,
  content,
  attrs,
});

const tweet = (url) => item('tweet', url, {
  class : 'row-span-2',
});

const instagram = (url) => item('instagram', url, {
  class : 'row-span-2',
});

const image = (url, alt) => item('image', url, {
  alt,
});

module.exports = [
  tweet('https://twitter.com/DavesArmoury/status/1329448611818696716'),
  tweet('https://twitter.com/DavesArmoury/status/1328061806997344257'),
  instagram('https://www.instagram.com/p/CHxw8jmghtj/'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
  image('//placehold.it/512x512', 'Some image of susan here'),
];

import {app, h, text} from '/assets/hyperapp.js';

const load = () => fetch('/assets/data.json').then((r) => r.json())

const thumbnailWithUrl = ({thumbnail, url, size}) => h(
    'a',
    {
      href : url,
      target : '_blank',
    },
    h('img', {src : thumbnail, class : {'w-auto' : true, [size] : true}}),
);

const thumbnailWithoutUrl = ({thumbnail, size}) =>
    h('img', {src : thumbnail, class : {'w-auto' : true, [size] : true}});

const thumbnail = (props) => {
  const size = props.size || 'h-48';
  const thumbnailProps = {...props, size};
  return props.url ? thumbnailWithUrl(thumbnailProps)
                   : thumbnailWithoutUrl(thumbnailProps);
};

const mountLatestVideosApp = (latestVideos) => {
  app({
    init : {
      latestVideos :
          latestVideos.map((lv) => ({...lv, size : lv.size || 'h-48'}))
    },
    view : state => h(
        'div',
        {
          class : [
            'flex',
            'flex-row',
            'flex-wrap',
            'items-center',
            'justify-between',
            'w-full',
            'flex-grow',
          ],
        },
        state.latestVideos.map(thumbnail),
        ),
    node : document.querySelector('#latest-videos'),
  });
};

const mountRobotIntroApp = (intro, node) => {
  app({
    init : {intro},
    view : state => h(
        'div',
        {class : 'mb-8'},
        thumbnail({
          ...state.intro,
          size : 'h-auto',
        }),
        ),
    node,
  });
};

const externalLink = ({value, url}) => h(
    'a',
    {
      href : url,
      target : '_blank',
      rel : 'noopener',
      class : [ 'font-semibold', 'border-b', 'hover:border-gray-600' ],
    },
    [
      text(value),
      h('i', {class : [ 'fa', 'fa-external-link text-small ml-2' ]}),
    ],
);

const mountRobotStatisticsApp = (statistics, node) => {
  app({
    init : {statistics},
    view : state => h(
        'div',
        {class : [ 'mb-8', 'text-lg', 'font-normal' ]},
        h(
            'table',
            {class : 'table-fixed'},
            h(
                'tbody',
                {},
                state.statistics.map(
                    (s) => h(
                        'tr',
                        {},
                        [
                          h('th', {class : 'text-left sm:w-1/4 pr-4'},
                            text(s.field)),
                          h('td', {}, s.url ? externalLink(s) : text(s.value)),
                        ],
                        ),
                    ),
                ),
            ),
        ),
    node,
  });
};

const mountRobotMediaApp = (media, node) => {
  app({
    init : {media},
    view : state => h(
        'div',
        {
          class : [
            'flex',
            'flex-row',
            'flex-wrap',
            'items-start',
            'justify-start',
            'sm:max-w-3/4',
          ],
        },
        state.media.map(
            (props) => h('div', {class : 'mr-2 mb-2'}, thumbnail(props)),
            ),
        ),
    node,
  });
};

load().then((data) => {
  mountLatestVideosApp(data.latestVideos);

  mountRobotIntroApp(
      data.susan.intro,
      document.querySelector('#app-intro-susan'),
  );
  mountRobotStatisticsApp(
      data.susan.statistics,
      document.querySelector('#app-statistics-susan'),
  );
  mountRobotMediaApp(
      data.susan.media,
      document.querySelector('#app-media-susan'),
  );

  mountRobotIntroApp(
      data.herman.intro,
      document.querySelector('#app-intro-herman'),
  );
  mountRobotStatisticsApp(
      data.herman.statistics,
      document.querySelector('#app-statistics-herman'),
  );
  mountRobotMediaApp(
      data.herman.media,
      document.querySelector('#app-media-herman'),
  );
});

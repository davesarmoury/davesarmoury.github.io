import {app, h, text} from '/assets/hyperapp.js';

const load = () => fetch('/assets/data.json').then((r) => r.json())

const imgClasses = (size) => ({
  'h-auto' : true,
  'sm:w-auto' : true,
  [`sm:${size}`] : true,
});

const thumbnailWithUrl = ({thumbnail, url, size}) => h(
    'a',
    {
      href : url,
      target : '_blank',
      class : imgClasses(size),
    },
    h('img', {src : thumbnail, class : 'h-full w-auto'}),
);

const thumbnailWithoutUrl = ({thumbnail, size}) =>
    h('img', {src : thumbnail, class : imgClasses(size)});

const thumbnail = (props) => {
  const size = props.size || 'h-48';
  const thumbnailProps = {...props, size};
  return props.url ? thumbnailWithUrl(thumbnailProps)
                   : thumbnailWithoutUrl(thumbnailProps);
};

const mountLatestVideosApp = (latestVideos) => {
  app({
    init : {
      latest : latestVideos[0],
      videos : latestVideos.slice(1).map(
          (lv) => ({...lv, size : lv.size || 'h-48'})),
    },
    view : state => {
      const largeColumns = Math.min(4, state.videos.length);
      // lg:grid-cols-1
      // lg:grid-cols-2
      // lg:grid-cols-3
      // lg:grid-cols-4

      return h(
          'div',
          {
            class : 'w-full px-2',
          },
          [
            h('div', {
              class : [
                'flex',
                'items-center',
                'justify-center',
                'mb-4',
                'w-full',
                'flex-grow',
              ],
            },
              h(
                  'a',
                  {
                    href : state.latest.url,
                    target : '_blank',
                    class : 'md:w-3/5 w-full',
                  },
                  h('img',
                    {src : state.latest.thumbnail, class : 'w-full h-auto'}),
                  )),
            h(
                'div',
                {
                  class : [
                    'grid',
                    'grid-cols-2',
                    `lg:grid-cols-${largeColumns}`,
                    'gap-1',
                    'w-full',
                    'flex-grow',
                  ],
                },
                state.videos.map(thumbnail),
                ),
          ],
      );
    },
    node : document.querySelector('#latest-videos'),
  });
};

const mountRobotIntroApp = (intro, node) => {
  app({
    init : {intro},
    view : state => h(
        'div',
        {class : 'mb-8 p-1 border border-gray-100'},
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
    view : state => {
      const largeColumns = Math.min(3, state.media.length);
      // lg:grid-cols-1
      // lg:grid-cols-2
      // lg:grid-cols-3
      return h(
          'div',
          {
            class : [
              'grid',
              'grid-cols-2',
              `lg:grid-cols-${largeColumns}`,
              'gap-1',
              'w-full',
              'flex-grow',
              'sm:mr-8',
            ],
          },
          state.media.map(
              (props) => h(
                  'div',
                  {
                    style : {
                      'background-image' : `url(${props.thumbnail})`,
                    },
                    class : 'bg-cover bg-center h-48 md:h-96'
                  },
                  ),
              ),
      );
    },
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

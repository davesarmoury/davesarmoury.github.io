import {app, h, text} from '/assets/hyperapp.js';

const load = () => fetch('/assets/data.json').then((r) => r.json())

const imgClasses = (size) => ({
  [size.w] : true,
  [size.h] : true,
  'bg-contain' : true,
  'bg-center' : true,
  'bg-no-repeat' : true,
});

const thumbnailWithoutUrl = ({thumbnail, size}) => h('div', {
  style : {
    'background-image' : `url(${thumbnail})`,
  },
  class : imgClasses(size)
});

const thumbnailWithUrl = ({thumbnail, url, size}) => h(
    'a',
    {
      href : url,
      target : '_blank',
    },
    thumbnailWithoutUrl({thumbnail, size}),
);

const thumbnail = (props) => {
  const size = {
    w : props.size && props.size.w || 'w-full',
    h : props.size && props.size.h || 'h-48',
  };
  const thumbnailProps = {...props, size};
  return props.url ? thumbnailWithUrl(thumbnailProps)
                   : thumbnailWithoutUrl(thumbnailProps);
};

const mountLatestVideosApp = (latestVideos) => {
  app({
    init : {
      latest : latestVideos[0],
      videos : latestVideos.slice(1),
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
        {class : 'my-8 p-1 border border-gray-100 w-3/5'},
        thumbnail({
          ...state.intro,
          size : {
            h : 'h-64',
            w : 'w-full',
          }
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
                  props.url ? 'a' : 'div',
                  {
                    href: props.url,
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

const mountTechnologiesApp = (technologies) => {
  app({
    init : {technologies},
    view : state => {
      const largeColumns = Math.min(4, state.technologies.length);
      // lg:grid-cols-1
      // lg:grid-cols-2
      // lg:grid-cols-3
      // lg:grid-cols-4

      return h(
                'div',
                {
                  class : [
                    'grid',
                    'grid-cols-1',
                    `lg:grid-cols-${largeColumns}`,
                    'gap-1',
                    'w-full',
                    'h-auto',
                    'flex-grow',
                  ],
                },

                state.technologies.map(
                    (props) => h(
                        props.url ? 'a' : 'div',
                        {
                          href: props.url,
                          style : {
                            'background-image' : `url(${props.thumbnail})`,
                          },
                          class : 'bg-cover bg-center h-48 md:h-full'
                        },
                    ),
                ),

      );
    },
    node : document.querySelector('#technologies'),
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

  mountTechnologiesApp(data.technologies);
});

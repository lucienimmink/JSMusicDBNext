const path = require('path');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const pwaArgs = [
  {
    name: 'JSMusicDB Next',
    short_name: 'JSDB',
    background_color: '#000000',
    theme_color: '#0078D7',
    icons: [
      {
        src: path.resolve('./src/img/icon-512-white.png'),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join('img', 'pwa')
      }
    ],
    start_url: '/',
    lang: 'en-UK',
    display: 'standalone'
  }
];

module.exports = {
  devServer: {
    port: 4200
  },
  integrity: true,
  // add new entries; this object is merged with the current config; this will never overwrite existing config
  configureWebpack: {
    resolve: {
      symlinks: true,
      alias: {
        '@': path.resolve(__dirname, 'src'),
        public: path.resolve(__dirname, 'public')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ico)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  },
  // see https://github.com/mozilla-neutrino/webpack-chain - update default config entries
  chainWebpack: (config) => {
    // update devtool
    config.devtool(process.env.NODE_ENV === 'production' ? false : 'eval-source-map');

    // update svg-loader

    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .clear()
      .loader('svg-url-loader')
      .options({
        noquotes: true,
        limit: 10 * 1024,
        name: '/img/[name].[hash:8].[ext]'
      });

    // update PWA settings
    config.plugins.delete('pwa');
    config.plugin('pwa-manifest').use(WebpackPwaManifest, pwaArgs);

    // set higher max entrypoint size (default: 244 but let's set it to 512 KB uncompressed).
    config.performance.maxEntrypointSize(512 * 1024);
  },
  pwa: {
    name: 'JSMusicDB Next',
    themeColor: '#0078D7',
    msTileColor: '#0078D7',
    appleMobileWebAppCapable: 'no',
    appleMobileWebAppStatusBarStyle: 'default',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/shared/js/service-worker.js',
      importWorkboxFrom: 'disabled'
    }
  }
};

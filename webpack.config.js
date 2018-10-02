const path = require('path');

module.exports = {
  resolve: {
    symlinks: true,
    '@': path.resolve(__dirname, 'src'),
    public: path.resolve(__dirname, 'public')
  }
};

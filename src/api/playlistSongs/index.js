const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {playlistSongsService, playlistService, validator}) => {
    const playlistSongsHandler = new PlaylistSongsHandler(playlistSongsService, playlistService, validator);
    server.route(routes(playlistSongsHandler));
  },
};

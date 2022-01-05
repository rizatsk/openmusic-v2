const InvariantError = require('../../exceptions/InvariantError');
const {PlaylistSongsloadSchema} = require('./schema');

const PlaylistSongsValidator = {
  validatePlaylistSongPayLoad: (payload) => {
    const validationResult = PlaylistSongsloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;

const InvariantError = require('../../exceptions/InvariantError');
const {PlaylistsloadSchema} = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayLoad: (payload) => {
    const validationResult = PlaylistsloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;

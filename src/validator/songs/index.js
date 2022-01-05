const InvariantError = require('../../exceptions/InvariantError');
const {SongPayloadSchema} = require('./schema');

const SongsValidator = {
  validateSongPayLoad: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;

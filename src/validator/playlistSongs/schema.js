const Joi = require('joi');

const PlaylistSongsloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {PlaylistSongsloadSchema};

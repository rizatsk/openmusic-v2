const Joi = require('joi');

const PlaylistsloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {PlaylistsloadSchema};

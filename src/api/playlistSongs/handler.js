const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistService, validator) {
    this._service = playlistSongsService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this); // bind untuk mengikat this agar isinya tetap sama tidak berubah
    this.getPlaylistIdSongsHandler = this.getPlaylistIdSongsHandler.bind(this);
    this.deletePlaylistIdSongHandler = this.deletePlaylistIdSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayLoad(request.payload);
      const {id: playlistId} = request.params;
      const {songId} = request.payload;
      const {id: owner} = request.auth.credentials;

      const playlistSongId = await this._service.addPlaylistSong({playlistId, songId, owner});

      const response = h.response({
        status: 'success',
        message: 'Playlist song berhasil ditambahkan',
        data: {
          playlistSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistIdSongsHandler(request, h) {
    try {
      const {id: playlistId} = request.params;
      const {id: owner} = request.auth.credentials;

      const playlist = await this._playlistService.getPlaylists(owner);
      const songs = await this._service.getPlaylistIdSongs(playlistId, owner);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistIdSongHandler(request, h) {
    try {
      const {id: playlistId} = request.params;
      const {id: owner} = request.auth.credentials;
      const {songId} = request.payload;

      await this._service.deletePlaylistIdSong(playlistId, songId, owner);

      return {
        status: 'success',
        message: 'Playlist song berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
